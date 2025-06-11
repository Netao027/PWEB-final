document.addEventListener('DOMContentLoaded', function () { // Garante que todo html foi gerado 
    document.getElementById('productForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const product = {  // váriavel constante onde vai estar armazenando as informações dos nossos produtos
            name: document.getElementById('productName').value,
            description: document.getElementById('description').value,
            price: parseFloat(document.getElementById('price').value),
            image: document.getElementById('imageURL').value
        };

        try {
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST', // Expeficico que farei uma requisição POST, pois irei registrar um novo produto
                headers: {
                    'Content-Type': 'application/json' // Expecificando que é um documento JSON
                },
                body: JSON.stringify(product) // converte a variavel product para JSON 
            });

            if (response.ok) { // Verifica se tudo deu certo
                alert('Produto registrado com sucesso!');
                event.target.reset();
            } else { // se algo der errado dispara uma mensagem dizendo que não foi possivel registrar o produto
                const error = await response.json();
                alert('Erro: ' + (error.message || 'Não foi possível registrar o produto.'));
            }
          // caso algum erro aconteça e o bloco try não consiga prosseguir essa parte do código será executada e retornará o erro       
        } catch (err) {
            console.error('Erro ao salvar produto:', err);
            alert('Erro de conexão com o servidor.');
        }
    });
});