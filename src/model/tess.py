"""Tessellate every leaf part of the STEP files into numpy meshes (CAD coordinates, mm).
Saves parts.pkl: list of dict(file, name, color, verts (N,3), faces (M,3))."""
import sys, pickle
sys.path.insert(0, '/tmp/claude-0/-home-claude/62fc1ebf-135e-5c98-88eb-1ce0026eb992/scratchpad')
from stepinfo import load, walk, Seq, XCAFDoc_DocumentTool, TopLoc_Location
import numpy as np
from OCP.BRepMesh import BRepMesh_IncrementalMesh
from OCP.TopExp import TopExp_Explorer
from OCP.TopAbs import TopAbs_FACE, TopAbs_REVERSED
from OCP.BRep import BRep_Tool
from OCP.TopoDS import TopoDS


def mesh_shape(shape, lin, ang=0.35):
    BRepMesh_IncrementalMesh(shape, lin, False, ang, True)
    V, F = [], []
    off = 0
    e = TopExp_Explorer(shape, TopAbs_FACE)
    while e.More():
        f = TopoDS.Face(e.Current())
        loc = TopLoc_Location()
        tri = BRep_Tool.Triangulation_s(f, loc)
        if tri is not None:
            tr = loc.Transformation()
            n = tri.NbNodes()
            pts = np.empty((n, 3))
            for i in range(1, n + 1):
                p = tri.Node(i).Transformed(tr)
                pts[i - 1] = (p.X(), p.Y(), p.Z())
            rev = f.Orientation() == TopAbs_REVERSED
            tris = np.empty((tri.NbTriangles(), 3), dtype=np.int64)
            for i in range(1, tri.NbTriangles() + 1):
                a, b, c = tri.Triangle(i).Get()
                tris[i - 1] = (a, c, b) if rev else (a, b, c)
            V.append(pts); F.append(tris - 1 + off); off += n
        e.Next()
    if not V:
        return None, None
    return np.vstack(V), np.vstack(F)


files = ['body.stp', 'glass_door.stp', 'table.stp', 'p7.stp', 'p15.stp', 'lcd.stp']
out = []
for fn in files:
    doc = load(fn)
    st = XCAFDoc_DocumentTool.ShapeTool_s(doc.Main())
    ct = XCAFDoc_DocumentTool.ColorTool_s(doc.Main())
    roots = Seq(); st.GetFreeShapes(roots)
    parts = []
    for R in roots:
        walk(st, ct, R, TopLoc_Location(), [], parts)
    for nm, shp, col in parts:
        if (nm.startswith('AS 1427') and fn != 'body.stp') or nm.startswith('spacer') or nm in ('PCB_1', 'LCD_7'):
            continue
        lin = 0.15 if fn in ('p7.stp', 'p15.stp') else 0.4
        v, f = mesh_shape(shp, 1.5, 1.2) if nm.startswith('AS 1427') else mesh_shape(shp, lin)
        if v is None:
            continue
        out.append(dict(file=fn, name=nm, color=col, verts=v, faces=f))
        print(f"{fn:15s} {nm[:45]:45s} tris {len(f):7d}", flush=True)
pickle.dump(out, open('parts.pkl', 'wb'))
print('total tris', sum(len(p['faces']) for p in out))
