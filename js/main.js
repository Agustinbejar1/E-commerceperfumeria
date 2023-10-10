let carrito = [];

document.addEventListener('DOMContentLoaded', () => {

    const listaProductos = document.querySelector("#productos");
    const contentCarrito = document.querySelector('#carrito tbody');
    const totalCompraElement = document.querySelector('#total-compra');


    if(JSON.parse(localStorage.getItem('carrito')) === null){
        carrito = []
    }else{
        carrito = JSON.parse(localStorage.getItem('carrito'))
    };
    
    dibujarCarritoHTML();
    
    listaProductos.addEventListener('click', agregarProducto);

    function agregarProducto(evt) {
        evt.preventDefault();
        if (evt.target.classList.contains('agregar')) {
            const producto = evt.target.parentElement.parentElement;
            infoProducto(producto);
        };
    };

    function infoProducto(item) {
        const readProduct = {
            imagen: item.querySelector('img').src,
            nombre: item.querySelector('#name-product').textContent,
            precio: item.querySelector('#precio-product').textContent,
            id: item.querySelector('button').getAttribute('id'),
            cantidad: 1,
        };

        if (carrito.some(prod => prod.id === readProduct.id)) {
            const productos = carrito.map(producto => {
                if (producto.id === readProduct.id) {
                    let cantidad = parseInt(producto.cantidad)
                    cantidad += 1
                    producto.cantidad = cantidad
                    return producto
                } else {
                    return producto
                }
            });

            carrito = productos.slice()
            } else {
                carrito.push(readProduct)
            };
            totalCompraElement.textContent = `$${calcularTotalCompra()}`;

        dibujarCarritoHTML();
    };

    function dibujarCarritoHTML() {
        limpiarCarrito();


        carrito.forEach((producto, index) => {
            const fila = document.createElement('tr')
            fila.innerHTML = `
                <td><img src="${producto.imagen}" width="100"/></td>
                <td>${producto.nombre}</td>
                <td>${producto.precio}</td>
                <td>${producto.cantidad}</td>
                <td>
                    <i class="bi bi-trash-fill delete-product " data-index="${index}"></i>
                </td>
            `
            contentCarrito.appendChild(fila);
        })
        sincronizarStorage()
    };

    function limpiarCarrito() {
        while (contentCarrito.firstChild) {
            contentCarrito.removeChild(contentCarrito.firstChild);
        }
    };

    contentCarrito.addEventListener('click', function(evt) {
        if (evt.target.classList.contains('delete-product')) {
            const index = evt.target.getAttribute('data-index');
            eliminarProducto(index);
            totalCompraElement.textContent = `$${calcularTotalCompra()}`;

            dibujarCarritoHTML();
        }
    });

    function eliminarProducto(index) {
        carrito.splice(index, 1);
    };


    function calcularTotalCompra() {
        let total = 0;
        carrito.forEach(producto => {
            const precioNumerico = parseFloat(producto.precio.replace('$', '').trim());
            total += precioNumerico * producto.cantidad;
        });
    
        return total.toFixed(2);
    };
    totalCompraElement.textContent = `$${calcularTotalCompra()}`;
    
});


function sincronizarStorage(){
    localStorage.setItem('carrito', JSON.stringify(carrito));
};