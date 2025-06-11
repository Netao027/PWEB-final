// Vai esperar o DOM ficar pronto
document.addEventListener('DOMContentLoaded', async function () {
    // Seleciona onde os produtos irão aparecer
    const grid = document.querySelector('.product-grid');
    // limpa o conteúdo dentro do grid
    grid.innerHTML = '';
        // try usado para tentar garantir que o código esteja totalmente funcional, caso tenha algum erro na API, REDE, etc... Ele retornará um erro que aparecerá no bloco catch
    try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
            throw new Error('Erro ao carregar produtos');
        }
        // Aqui se obtém os dados da API e acessa os produtos
        const data = await response.json();
        const produtos = data.products;
        // Verifica se tem produtos cadastrados, caso não tenha aparecerá na tela que não tem produtos cadastrados
        if (produtos.length === 0) {
            grid.innerHTML = '<p>Nenhum produto cadastrado ainda.</p>';
            return;
        }
        // Aqui ele vai pegar cada array de produtos criar uma div e inserir as informações do produto, após isso colocará a div dentro do container (grid)
        produtos.forEach(prod => {
            const card = document.createElement('div');
            card.className = 'product-card';

            card.innerHTML = `
                <div class="image-placeholder">
                    <img src="${prod.image}" alt="${prod.name}">
                </div>
                <h2>${prod.name}</h2>
                <p>${prod.description}</p>
                <span class="price">R$ ${prod.price.toFixed(2)}</span>
                <button class="add-to-cart">Adicionar ao Carrinho</button>
            `;

            grid.appendChild(card);
        });
    //Caso aconteça algum erro exibe mensagem na tela e aparece o erro no console
    } catch (error) {
        console.error(error);
        grid.innerHTML = '<p>Erro ao carregar os produtos.</p>';
    }
});