const fs = require('fs');
let c = fs.readFileSync('c:/Users/death/OneDrive/Escritorio/Tomin/savings-boxes-app/src/components/Dashboard.jsx', 'utf8');
c = c.replace(/const handleCreateBox \= \(newBox\) \=\> \{\r?\n\s*setBoxes\(\[\.\.\.boxes, newBox\]\);\r?\n\s*console\.log\(['\][^)]+\);\r?\n\s*\};/, \const handleCreateBox = async (newBox) => { try { const r = await axios.post('http://localhost:3001/api/boxes', { userId: 1, name: newBox.name, icon: newBox.icon || newBox.iconType, goal: newBox.goal }); if(r.data.success) { setBoxes([...boxes, r.data.data]); } } catch(e) { console.error(e); } setIsCreateModalOpen(false); };\);
fs.writeFileSync('c:/Users/death/OneDrive/Escritorio/Tomin/savings-boxes-app/src/components/Dashboard.jsx', c.replace(/^\uFEFF/, ''), 'utf8');
