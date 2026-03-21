const fs = require('fs');

let loginContent = fs.readFileSync('c:/Users/death/OneDrive/Escritorio/Tomin/savings-boxes-app/src/components/Login.jsx', 'utf8');
const newLoginSubmit = `const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return
    
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      if (data.success) {
        onLogin(data.user);
      } else {
        alert(data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  }`;
loginContent = loginContent.replace(/const handleSubmit = async \(e\) => {[\s\S]*?onLogin\(\{ email, name: 'Ángeles' \}\)\r?\n  \}/, newLoginSubmit);
fs.writeFileSync('c:/Users/death/OneDrive/Escritorio/Tomin/savings-boxes-app/src/components/Login.jsx', loginContent, 'utf8');

let regContent = fs.readFileSync('c:/Users/death/OneDrive/Escritorio/Tomin/savings-boxes-app/src/components/Register.jsx', 'utf8');
const newRegSubmit = `const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.password || !acceptTerms) return
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: formData.name, 
          email: formData.email, 
          password: formData.password 
        }),
      });
      const data = await response.json();
      
      if (data.success) {
        onRegister(data.user);
      } else {
        alert(data.message || 'Error al registrarse');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  }`;
regContent = regContent.replace(/const handleSubmit = async \(e\) => {[\s\S]*?onRegister\(\{ email: formData.email, name: formData.name \}\)\r?\n  \}/, newRegSubmit);
fs.writeFileSync('c:/Users/death/OneDrive/Escritorio/Tomin/savings-boxes-app/src/components/Register.jsx', regContent, 'utf8');

console.log('Fixed auth forms');