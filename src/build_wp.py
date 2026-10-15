"""WordPress plugin bundle: page/uhp-page-fa.js -> page/uhp-page-wp.js (all files from the plugin folder)."""
import re
s=open('/home/claude/gosite-page/page/uhp-page-fa.js',encoding='utf-8').read()
s,n1=re.subn(r"var BASE = me \? '[^']*' : '';", "var BASE = (window.UHP_WP && window.UHP_WP.base) || '';", s)
s,n2=re.subn(r"var CBASE = me \? [^;]*;", "var CBASE = (window.UHP_WP && window.UHP_WP.root) || '';", s)
assert n1==1 and n2==1, (n1,n2)
open('/home/claude/gosite-page/page/uhp-page-wp.js','w',encoding='utf-8').write(s); print('ok', len(s))
