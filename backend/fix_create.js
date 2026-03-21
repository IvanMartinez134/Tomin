const fs = require('fs');

const targetPath = 'c:/Users/death/OneDrive/Escritorio/Tomin/savings-boxes-app/src/components/Dashboard.jsx';
let content = fs.readFileSync(targetPath, 'utf8');

const targetFunc = "const handleCreateBox = (newBox) => {";
const endFunc = "  };";

// Simple string replacement instead of regex to avoid mismatch due to newlines
const parts = content.split("const handleCreateBox = (newBox) => {");
if (parts.length > 1) {
    const afterFuncParts = parts[1].split("console.log('? Nueva caja creada:', newBox);\r\n  };");
    const afterFuncParts2 = parts[1].split("console.log('? Nueva caja creada:', newBox);\n  };");
    
    let remainder = "";
    if (afterFuncParts.length > 1) {
        remainder = afterFuncParts[1];
    } else if (afterFuncParts2.length > 1) {
        remainder = afterFuncParts2[1];
    } else {
        // Fallback if formatting doesn't match
        const findClose = parts[1].indexOf("};");
        remainder = parts[1].substring(findClose + 2);
    }

    const replacement = const handleCreateBox = async (newBox) => {
    try {
      const response = await axios.post('http://localhost:3001/api/boxes', {
        userId: 1, // Usuario simulado
        name: newBox.name,
        icon: newBox.icon || newBox.iconType,
        goal: newBox.goal || null
      });
      if(response.data.success) {
        setBoxes([...boxes, response.data.data]);
        console.log('? Nueva caja:', response.data.data);
      }
    } catch (e) {
      console.error(e);
      alert('Error creando caja');
    }
  };;
    
    content = parts[0] + replacement + remainder;
    fs.writeFileSync(targetPath, content.replace(/^\uFEFF/, ''), 'utf8');
    console.log("Dashboard handleCreateBox updated.");
} else {
    console.log("Could not find handleCreateBox function declaration.");
}
