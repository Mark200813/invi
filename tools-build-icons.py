import numpy as np, colorsys, os
from PIL import Image
SRC = r"C:\Users\markk\Downloads"
OUT = r"C:\Users\markk\invi-website"
names = {"origin":"Gemini_Generated_Image_6e0yd16e0yd16e0y.jpg",
         "rise"  :"Gemini_Generated_Image_6e0yd16e0yd16e0y (1).jpg",
         "moon"  :"Gemini_Generated_Image_6e0yd16e0yd16e0y (2).jpg"}
SIZE, TARGET_DISC = 640, 500*640//768
GAIN = {"origin":1.12,"rise":1.0,"moon":1.0}

def smoothstep(x,a,b):
    t = np.clip((x-a)/(b-a),0,1); return t*t*(3-2*t)

def warm_the_cyan(a):
    """Rotate the green->cyan band to amber. Nothing else in these frames
       lives in that hue range, so the discs and haloes are untouched."""
    r,g,b = a[...,0]/255, a[...,1]/255, a[...,2]/255
    mx, mn = a.max(2)/255, a.min(2)/255
    v, c = mx, mx-mn
    s = np.where(mx>0, c/np.maximum(mx,1e-6), 0)
    h = np.zeros_like(mx)
    m = c>1e-6
    idx = (mx==r/1)&m; h[idx] = ((g-b)[idx]/c[idx])%6
    idx = (mx==g/1)&m; h[idx] = ((b-r)[idx]/c[idx])+2
    idx = (mx==b/1)&m; h[idx] = ((r-g)[idx]/c[idx])+4
    h *= 60
    band = smoothstep(h,42,60)*(1-smoothstep(h,200,240))     # yellow-green through cyan
    band *= smoothstep(s,.06,.16)
    h2 = np.where(band>0, 32.0, h)                            # amber
    s2 = s*(1-band*0.45)
    v2 = v*(1-band*0.30)
    # HSV -> RGB, vectorised
    hh = h2/60.0; i = np.floor(hh).astype(int)%6; f = hh-np.floor(hh)
    p, q, t = v2*(1-s2), v2*(1-s2*f), v2*(1-s2*(1-f))
    out = np.choose(i[...,None].repeat(3,2),
        [np.dstack([v2,t,p]),np.dstack([q,v2,p]),np.dstack([p,v2,t]),
         np.dstack([p,q,v2]),np.dstack([t,p,v2]),np.dstack([v2,p,q])])
    return np.where((band>0)[...,None], out*255, a)

for k,f in names.items():
    a = np.asarray(Image.open(os.path.join(SRC,f)).convert('RGB')).astype(float)

    # measure the disc untouched, at half its own peak, so the three compare
    # like for like regardless of how hot each centre runs
    l0 = a.max(axis=2)
    ys,xs = np.where(l0 > l0.max()*0.5)
    dia = xs.max()-xs.min()                       # horizontal extent = true diameter
    cx  = (xs.min()+xs.max())/2
    cy  = ys.min()+dia/2                          # origin's disc is cut off below

    # 1. sunlight, not seawater, on the horizon haze
    if k=="origin":
        a = warm_the_cyan(a)
        cy -= dia*0.04                            # leave room for the horizon band

    # 2. brightness match, rolled off so the core never clips
    if GAIN[k]!=1.0:
        a = 255*(1-np.exp(-a*GAIN[k]/255*1.25))/(1-np.exp(-1.25))

    # 3. soft black floor kills the JPEG mush without touching the halo
    a *= smoothstep(a.max(axis=2), 2.5, 9.0)[...,None]

    # 4. shared disc size and optical centre
    s = TARGET_DISC/dia
    im = Image.fromarray(np.clip(a,0,255).astype(np.uint8)).resize(
            (round(a.shape[1]*s), round(a.shape[0]*s)), Image.LANCZOS)
    canvas = Image.new('RGB',(SIZE,SIZE),(0,0,0))
    canvas.paste(im, (round(SIZE/2-cx*s), round(SIZE/2-cy*s)))

    # 5. alpha from emitted light, so they sit on any sky
    b = np.asarray(canvas).astype(float)
    alpha = np.clip(b.max(axis=2)/255*1.06, 0, 1)
    rgba = Image.fromarray(np.dstack([b, alpha*255]).astype(np.uint8),'RGBA')
    p = os.path.join(OUT,f"icon-{k}.webp")
    rgba.save(p, 'WEBP', quality=90, method=6)
    print(f"icon-{k}.webp  disc {dia:.0f}->{TARGET_DISC} (x{s:.2f})  {os.path.getsize(p)/1024:.0f}KB")
