const fs = require('fs');

function fixFile(file) {
  let content = fs.readFileSync(file);
  
  if (content.length >= 2 && content[0] === 0xFF && content[1] === 0xFE) {
     content = content.toString('utf16le');
  } else {
     content = content.toString('utf8');
  }

  content = content.replace(/^\uFEFF/, '').trimStart();
  if (content.startsWith('"use client"')) {
     content = content.replace(/"use client"\s*/, '');
  }
  
  fs.writeFileSync(file, content, 'utf8');
}

fixFile('c:/Users/death/OneDrive/Escritorio/Tomin/savings-boxes-app/src/App.jsx');
fixFile('c:/Users/death/OneDrive/Escritorio/Tomin/savings-boxes-app/src/components/Dashboard.jsx');
fixFile('c:/Users/death/OneDrive/Escritorio/Tomin/savings-boxes-app/src/components/LoginButton.jsx');
fixFile('c:/Users/death/OneDrive/Escritorio/Tomin/savings-boxes-app/src/components/Navbar.jsx');
fixFile('c:/Users/death/OneDrive/Escritorio/Tomin/savings-boxes-app/src/components/Login.jsx');
fixFile('c:/Users/death/OneDrive/Escritorio/Tomin/savings-boxes-app/src/components/Register.jsx');
fixFile('c:/Users/death/OneDrive/Escritorio/Tomin/savings-boxes-app/src/components/SubscriptionPlans.jsx');
fixFile('c:/Users/death/OneDrive/Escritorio/Tomin/savings-boxes-app/src/components/SupportCenter.jsx');

console.log('Fixed all encodings');
