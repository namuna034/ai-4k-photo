# AI Photo Editor — Setup Guide

## Steps

### 1. Naya Expo project banayein
```
npx create-expo-app MeraPhotoApp
cd MeraPhotoApp
```

### 2. Image picker library install karein
```
npx expo install expo-image-picker
```

### 3. App.js replace karein
Diya gaya `App.js` file, project ke `App.js` ki jagah copy-paste kar dein.

### 4. API keys daalein
File ke upar yeh lines dhundein aur apni keys daalein:
```
const REMOVE_BG_KEY = 'YOUR_REMOVE_BG_KEY_HERE';
const STABILITY_KEY = 'YOUR_STABILITY_API_KEY_HERE';
```

### 5. App start karein
```
npx expo start
```

Phone pe **Expo Go** app se QR code scan karein.

## App kaise kaam karta hai

1. **"Photo Chuniye"** — gallery se photo select karein
2. **"Background Hataein"** — remove.bg se background hata dega
3. **Style box mein likhein** (jaise "anime", "watercolor painting", "cartoon") aur **"Style Lagayein"** dabayein — Stability AI se naya style apply hoga

## Credits / Cost

- **remove.bg**: Free tier mein limited images milte hain, uske baad paid
- **Stability AI**: 25 free credits milte hain signup pe, uske baad credits kharidne padte hain (~1 cent per image)

## Agla Kadam

Jab yeh test ho jaye aur sahi chale, toh hum ismein:
- Photo **save/share** karne ka button add kar sakte hain
- **Loading progress** better bana sakte hain
- Agar monetize karna hai, toh backend + payment system add karenge (pichle video app wale plan jaisa)
