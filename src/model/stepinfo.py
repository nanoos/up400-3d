import sys, os
from OCP.STEPCAFControl import STEPCAFControl_Reader
from OCP.TDocStd import TDocStd_Document
from OCP.TCollection import TCollection_ExtendedString
from OCP.XCAFDoc import XCAFDoc_DocumentTool, XCAFDoc_ColorType
from OCP.collections import Sequence_TDF_Label as Seq
from OCP.TDF import TDF_Label
from OCP.TDataStd import TDataStd_Name
from OCP.Bnd import Bnd_Box
from OCP.BRepBndLib import BRepBndLib
from OCP.TopExp import TopExp_Explorer
from OCP.TopAbs import TopAbs_SOLID
from OCP.Quantity import Quantity_Color
from OCP.TopLoc import TopLoc_Location


def name(lbl):
    a = TDataStd_Name()
    if lbl.FindAttribute(TDataStd_Name.GetID_s(), a):
        return a.Get().ToExtString()
    return '?'


def bbox(shape):
    b = Bnd_Box(); BRepBndLib.Add_s(shape, b, True)
    if b.IsVoid(): return (0,0,0,0,0,0)
    a=b.CornerMin(); c=b.CornerMax()
    return (a.X(),a.Y(),a.Z(),c.X(),c.Y(),c.Z())


def nsolids(shape):
    n = 0; e = TopExp_Explorer(shape, TopAbs_SOLID)
    while e.More():
        n += 1; e.Next()
    return n


def load(path):
    doc = TDocStd_Document(TCollection_ExtendedString("doc"))
    r = STEPCAFControl_Reader(); r.SetColorMode(True); r.SetNameMode(True)
    r.ReadFile(path); r.Transfer(doc)
    return doc


def color(ct, *labels):
    c = Quantity_Color()
    for lab in labels:
        for t in (XCAFDoc_ColorType.XCAFDoc_ColorSurf, XCAFDoc_ColorType.XCAFDoc_ColorGen):
            if type(ct).GetColor_s(lab, t, c):
                return '#%02x%02x%02x' % (int(c.Red()*255), int(c.Green()*255), int(c.Blue()*255))
    return ''


def walk(st, ct, L, loc, path, out):
    """Collect leaf parts with their global placement."""
    if st.IsReference_s(L):
        ref = TDF_Label(); st.GetReferredShape_s(L, ref)
        loc = loc.Multiplied(st.GetLocation_s(L))
        walk(st, ct, ref, loc, path + [name(L)], out); return
    if st.IsAssembly_s(L):
        comps = Seq(); st.GetComponents_s(L, comps, False)
        for C in comps:
            walk(st, ct, C, loc, path, out)
        return
    shp = st.GetShape_s(L).Moved(loc)
    out.append(('/'.join(path) or name(L), shp, color(ct, L)))


if __name__ == '__main__':
    for p in sys.argv[1:]:
        doc = load(p)
        st = XCAFDoc_DocumentTool.ShapeTool_s(doc.Main())
        ct = XCAFDoc_DocumentTool.ColorTool_s(doc.Main())
        roots = Seq(); st.GetFreeShapes(roots)
        for R in roots:
            shp = st.GetShape_s(R); b = bbox(shp)
            print("=====", os.path.basename(p), "| root:", name(R), "| solids:", nsolids(shp))
            print("  overall %.1f x %.1f x %.1f mm   x[%.1f,%.1f] y[%.1f,%.1f] z[%.1f,%.1f]" % (
                b[3]-b[0], b[4]-b[1], b[5]-b[2], b[0], b[3], b[1], b[4], b[2], b[5]))
            out = []; walk(st, ct, R, TopLoc_Location(), [], out)
            print("  leaf parts:", len(out))
            for nm, s, col in out[:200]:
                bb = bbox(s)
                print("   - %-55s %6.1f x %6.1f x %6.1f  x[%5.0f,%5.0f] y[%5.0f,%5.0f] z[%5.0f,%5.0f] %s" % (
                    nm[-55:], bb[3]-bb[0], bb[4]-bb[1], bb[5]-bb[2], bb[0], bb[3], bb[1], bb[4], bb[2], bb[5], col))
