
const fs = require("fs");
let c = fs.readFileSync("c:/Users/death/OneDrive/Escritorio/Tomin/savings-boxes-app/src/components/Dashboard.jsx", "utf8");

c = c.replace(/const handleWithdraw = \(box\) => \{[\s\S]*?alert\([^)]+\);[\s\S]*?\};/, `const handleWithdraw = async (box) => {
    const amt = prompt("Monto a retirar:");
    if(!amt || isNaN(amt)) return;
    try {
        const r = await axios.post(\`http://localhost:3001/api/boxes/\${box.id}/withdraw\`, { amount: Number(amt) });
        if(r.data.success) {
            setBoxes(boxes.map(b => b.id === box.id ? { ...b, current_balance: r.data.data.current_balance } : b));
            alert("Retiro exitoso");
        }
    } catch(e) {
        console.error(e);
        alert("Error al retirar");
    }
};`);

fs.writeFileSync("c:/Users/death/OneDrive/Escritorio/Tomin/savings-boxes-app/src/components/Dashboard.jsx", c.replace(/^\uFEFF/, ""), "utf8");
console.log("Updated withdraw");

