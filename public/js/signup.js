document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const name = document.getElementById('name').value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    try {
        const response = await fetch('/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, name, password})
        })
        const result = response.json()
        if(response.ok) {
            // localStorage.setItem('token', result.accessToken)
            // console.log(result.accessToken)
            window.location.href = '/'

        } else {
            console.log('signup failed', result.message)
        }
        
        
    } catch (error) {
        console.log(error)
    }
})