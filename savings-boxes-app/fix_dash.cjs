const fs = require('fs');

let content = fs.readFileSync('c:/Users/death/OneDrive/Escritorio/Tomin/savings-boxes-app/src/components/Dashboard.jsx', 'utf8');

const importReplacement = `import { mockSavingsBoxes } from '../data/mockData';\nimport { useEffect } from 'react';\nimport axios from 'axios';`;

content = content.replace(/import \{ mockSavingsBoxes \} from '\.\.\/data\/mockData';/g, importReplacement);

const fetchEffect = `const [boxes, setBoxes] = useState([]);
  
  // Fetch from backend whenever user changes/mounts
  useEffect(() => {
    const fetchBoxes = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/boxes?userId=1');
        if(response.data.success) {
          setBoxes(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching boxes", error);
      }
    };
    fetchBoxes();
  }, []);`;
  
content = content.replace(/const \[boxes, setBoxes\] = useState\(mockSavingsBoxes\);/g, fetchEffect);

const createBoxReplacement = `const handleCreateBox = async (newBox) => {
    try {
      const response = await axios.post('http://localhost:3001/api/boxes', {
        userId: 1,
        name: newBox.name,
        icon: newBox.icon || newBox.iconType,
        goal: newBox.goal
      });
      if(response.data.success) {
        setBoxes([...boxes, response.data.data]);
        console.log('✅ Nueva caja creada en backend:', response.data.data);
      }
    } catch (e) {
      console.error(e);
      alert('Error creating box');
    }
    setIsCreateModalOpen(false);
  };`;

content = content.replace(/const handleCreateBox = \(newBox\) => \{[\s\S]*?console.log\([^\)]*\);[\s\S]*?\s* setIsCreateModalOpen\(false\);\s*\n?\s*\};/g, createBoxReplacement);

const depositReplacement = `const handleDepositSuccess = async (depositInfo) => {
    try {
      const response = await axios.post(\`http://localhost:3001/api/boxes/\${depositInfo.boxId}/deposit\`, {
        amount: depositInfo.amount
      });
      if(response.data.success) {
        setBoxes((prevBoxes) =>
          prevBoxes.map((box) =>
            box.id === depositInfo.boxId
              ? { ...box, currentBalance: response.data.data.currentBalance }
              : box
          )
        );
        console.log('✅ Depósito completado en backend:', response.data.data);
      }
    } catch(e) {
       console.error(e);
       alert('Error deposit');
    }
  };`;

content = content.replace(/const handleDepositSuccess = \(depositInfo\) => \{[\s\S]*?console\.log\([^\)]*\);\n  \};/, depositReplacement);

fs.writeFileSync('c:/Users/death/OneDrive/Escritorio/Tomin/savings-boxes-app/src/components/Dashboard.jsx', content, 'utf8');

console.log('Fixed Dashboard backend endpoints');