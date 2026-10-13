"""Group tessellated parts into a web-ready GLB.
CAD frame (mm): x = device's right (viewer's left), y = down, z = front.
three.js frame (m): (x, y, z) -> (-x, -y, z) / 1000  -> +y up, +z towards viewer, +x viewer's right."""
import pickle, numpy as np, trimesh
from trimesh.visual.material import PBRMaterial

P = pickle.load(open('parts.pkl', 'rb'))

def hexrgb(h):
    h = h.lstrip('#'); return [int(h[i:i+2], 16) for i in (0, 2, 4)] + [255]

MAT = {
    'white':    dict(c='#ebe7e2', m=0.0, r=0.55),
    'whiteint': dict(c='#e6e3df', m=0.0, r=0.7),
    'titanium': dict(c='#c6c8cc', m=0.9, r=0.32),
    'steel':    dict(c='#d4d7db', m=0.9, r=0.22),
    'alu':      dict(c='#b7babe', m=0.6, r=0.45),
    'black':    dict(c='#0c0c0e', m=0.1, r=0.25),
    'rubber':   dict(c='#1a1a1c', m=0.0, r=0.8),
    'touchglass': dict(c='#070708', m=0.1, r=0.2),
    'grey':     dict(c='#8a8a8c', m=0.3, r=0.5),
    'screw':    dict(c='#b9bcc0', m=0.9, r=0.3),
    'silicone': dict(c='#c4161c', m=0.0, r=0.65),
    'head':     dict(c='#ebe7e2', m=0.0, r=0.55),
    'blue':     dict(c='#0f2fd8', m=0.0, r=0.5),
    'pcb':      dict(c='#07588b', m=0.0, r=0.5),
}

def material_for(p):
    n = p['name']
    if 'Horn' in n or 'horn' in n or 'booster' in n: return 'titanium'
    if n.startswith('AS 1427'): return 'screw'
    if 'Silicon' in n: return 'silicone'
    if n.startswith(('Dwin box', 'Dwin L back')): return 'head'
    if 'Shaft' in n: return 'steel'
    if 'LBE8' in n: return 'steel'
    if n.startswith('TOP_0'): return 'black'
    if n.startswith('CTP_5'): return 'touchglass'
    if 'Rocky' in n or 'Fan' in n or 'lastic' in n: return 'rubber'
    if 'Driver back plate' in n: return 'alu'
    if 'Power input' in n: return 'blue'
    if 'LED PCB' in n: return 'pcb'
    if any(k in n for k in ('RS232', 'Majovie', 'PT100')): return 'grey'
    if 'internal wall' in n or 'zig zag' in n or 'nodal' in n: return 'whiteint'
    return 'white'

def group_for(p):
    f, n = p['file'], p['name']
    if f == 'glass_door.stp':
        return 'door' if n.startswith('front door') else None
    if f == 'table.stp': return 'table'
    if f == 'p7.stp': return 'probe7'
    if f == 'p15.stp': return 'probe15'
    if f == 'lcd.stp': return None
    v = p['verts']; c = (v.min(0) + v.max(0)) / 2
    if 'booster' in n or 'nodal' in n: return 'stack'
    if c[1] < -258: return 'head'
    if n.startswith('lastic paye'): return 'head'
    if c[2] < -125 and not n.startswith(('05 back side', 'internal wall')): return 'back'
    return 'body'

DROP = ('MFQ_18', 'back label', '40x40x10 DC Fan')

def to_three(v):
    return np.column_stack([-v[:, 0], -v[:, 1], v[:, 2]]) / 1000.0

buckets = {}
for p in P:
    if p['name'].startswith(DROP): continue
    g = group_for(p)
    if g is None: continue
    key = (g, material_for(p))
    buckets.setdefault(key, []).append(p)

scene = trimesh.Scene()
for g in ['body', 'door', 'table', 'probe7', 'probe15', 'head', 'stack', 'back']:
    scene.graph.update(frame_to=g, frame_from=scene.graph.base_frame)

MAT['chamber'] = dict(c='#f2f4ff', m=0.0, r=0.6)

def chamber_split(V, F):
    # triangles of the body shell that lie inside the sound chamber (CAD box, mm, converted to m)
    c = V[F].mean(1)
    inside = (np.abs(c[:, 0]) < 0.1425) & (c[:, 1] > -0.2485) & (c[:, 1] < 0.2395) & (c[:, 2] > -0.141) & (c[:, 2] < 0.1415)
    return inside

items = []
for (g, mk), plist in buckets.items():
    V, F, off = [], [], 0
    for p in plist:
        V.append(to_three(p['verts'])); F.append(p['faces'] + off); off += len(p['verts'])
    V = np.vstack(V); F = np.vstack(F)
    if g == 'body' and mk in ('white', 'whiteint'):
        ins = chamber_split(V, F)
        items.append(('body', 'chamber', V, F[ins])); items.append((g, mk, V, F[~ins]))
    else:
        items.append((g, mk, V, F))
merged = {}
for g, mk, V, F in items:
    merged.setdefault((g, mk), []).append((V, F))
for (g, mk), lst in merged.items():
    VV, FF, off = [], [], 0
    for V, F in lst:
        used = np.unique(F); remap = -np.ones(len(V), int); remap[used] = np.arange(len(used)) + off
        VV.append(V[used]); FF.append(remap[F]); off += len(used)
    m = trimesh.Trimesh(np.vstack(VV), np.vstack(FF), process=False)
    _ = m.vertex_normals  # per-BRep-face smooth normals (faces do not share vertices)
    spec = MAT[mk]
    m.visual = trimesh.visual.TextureVisuals(material=PBRMaterial(
        name=f'{g}__{mk}', baseColorFactor=hexrgb(spec['c']), metallicFactor=spec['m'], roughnessFactor=spec['r']))
    scene.add_geometry(m, node_name=f'{g}__{mk}', geom_name=f'{g}__{mk}', parent_node_name=g)
    print(g, mk, len(m.faces))

# Textured screen quad, 0.1 mm proud of the LCD glass (CAD coordinates).
n = np.array([0, -0.173648, 0.984808])
TL = np.array([30.72, -393.36, 95.19]); TR = np.array([-34.88, -393.35, 95.19])
BL = np.array([30.74, -286.21, 114.08]); BR = np.array([-34.86, -286.21, 114.08])
quad = np.array([TL, TR, BL, BR]) + n * 0.6
qv = to_three(quad)
faces = np.array([[0, 2, 1], [1, 2, 3]])
nt = np.array([0, 0.173648, 0.984808])
nrm = np.cross(qv[faces[0][1]] - qv[faces[0][0]], qv[faces[0][2]] - qv[faces[0][0]])
if nrm @ nt < 0: faces = faces[:, ::-1]
uv = np.array([[0, 1], [1, 1], [0, 0], [1, 0]], float)
sq = trimesh.Trimesh(qv, faces, process=False)
sq.visual = trimesh.visual.TextureVisuals(uv=uv, material=PBRMaterial(name='screen', baseColorFactor=[255, 255, 255, 255]))
scene.add_geometry(sq, node_name='screen', geom_name='screen', parent_node_name='head')
print('screen quad centre', qv.mean(0), 'normal ok')

open('parts.glb','wb').write(trimesh.exchange.gltf.export_glb(scene, include_normals=True))
out = trimesh.exchange.gltf.export_gltf(scene, include_normals=True, embed_buffers=True)
open('parts.json','wb').write(out['model.gltf'])
print('JSON MB', os.path.getsize('parts.json')/1e6) if False else None
import os
print('JSON MB', os.path.getsize('parts.json') / 1e6); print('GLB MB', os.path.getsize('parts.glb') / 1e6)
