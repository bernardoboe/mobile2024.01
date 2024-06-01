document.addEventListener('deviceready', onDeviceReady, false);

let PIZZARIA_ID, currImgData, listaPizzasCadastradas;

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);

    cordova.plugin.http.setDataSerializer('json');

    PIZZARIA_ID = 'boe1'; 
    currImgData = "";
    listaPizzasCadastradas = [];

    document.getElementById('btnNovo').addEventListener('click', () => {
        mostrarCadastro();
    });

    document.getElementById('btnCancelar').addEventListener('click', () => {
        mostrarLista();
    });

    document.getElementById('btnFoto').addEventListener('click', takePicture);

    document.getElementById('btnSalvar').addEventListener('click', savePizza);

    document.getElementById('btnExcluir').addEventListener('click', deletePizza);

    carregarPizzas();
    mostrarLista();
}

function changeScreen(btn) {
    let { nextScreen, originScreen } = btn.srcElement.dataset;

    document.getElementById(originScreen).style.display = 'none';
    document.getElementById(nextScreen).style.display = 'flex';

    currImgData = "";
}

function carregarPizzas() {
    cordova.plugin.http.get('https://pedidos-pizzaria.glitch.me/admin/pizzas/' + PIZZARIA_ID, {}, {}, response => {
        if (response.data !== "") {
            listaPizzasCadastradas = JSON.parse(response.data);
            atualizarListaPizzas();
        }
    }, response => {
        alert( 'Pizza adicionada com sucesso');
    });
}

function atualizarListaPizzas() {
    let listaPizzas = document.getElementById('listaPizzas');
    listaPizzas.innerHTML = '';

    listaPizzasCadastradas.forEach((item, idx) => {
        const novo = document.createElement('div');
        novo.classList.add('linha');
        novo.innerHTML = item.pizza;
        novo.id = idx;
        novo.onclick = function () {
            carregarDadosPizza(novo.id);
        };
        listaPizzas.appendChild(novo);
    });
}

function carregarDadosPizza(id) {
    mostrarCadastro();
    let pizzaData = listaPizzasCadastradas[id];
    document.getElementById('pizza').value = pizzaData.pizza;
    document.getElementById('preco').value = pizzaData.preco;
    document.getElementById('imagem').style.backgroundImage = pizzaData.imagem;
}

function mostrarCadastro() {
    document.getElementById('applista').style.display = 'none';
    document.getElementById('appcadastro').style.display = 'flex';
}

function mostrarLista() {
    document.getElementById('appcadastro').style.display = 'none';
    document.getElementById('applista').style.display = 'flex';
}

function takePicture() {
    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL
    });

    function onSuccess(imageData) {
        currImgData = 'data:image/jpeg;base64,' + imageData;
        document.getElementById('imagem').style.backgroundImage = 'url(' + currImgData + ')';
    }

    function onFail(message) {
        alert('Failed because: ' + message);
    }
}

function savePizza() {
    const pizzaName = document.getElementById('pizza').value;
    const pizzaPrice = document.getElementById('preco').value;

    const newPizza = {
        pizzaria: PIZZARIA_ID,
        pizza: pizzaName,
        preco: pizzaPrice,
        imagem: currImgData
    };

    cordova.plugin.http.post('https://pedidos-pizzaria.glitch.me/admin/pizza/', newPizza, {}, response => {
        carregarPizzas();
        mostrarLista();
    }, response => {
        carregarPizzas();
        mostrarLista();
        alert('Pizza salva com sucesso');
    });
}

function deletePizza() {
    const pizzaName = document.getElementById('pizza').value;

    cordova.plugin.http.delete('https://pedidos-pizzaria.glitch.me/admin/pizza/' + PIZZARIA_ID + '/' + pizzaName, {}, {}, response => {

        carregarPizzas();
        mostrarLista();
    }, response => {
        carregarPizzas();
        mostrarLista();
        alert('Pizza excluída com sucesso');
    });
}
