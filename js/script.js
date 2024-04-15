document.addEventListener('DOMContentLoaded', ()=>
{

//Variables

const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaProductos = document.querySelector('#lista-productos');
const darkMode = document.querySelector('#toggle-dark-mode');
const searchInput = document.querySelector('#search');
const tarjeta = document.querySelectorAll('.card');
const containerSearchProducts = document.querySelector('#lista-productos-search');
containerSearchProducts.style.display = 'none';

//Arreglo de la compra
let articulosCarrito = [];

//Cargar todos los eventos
cargarEventos();

function cargarEventos()
{
    //darkmode
    darkToggle();

	//busqueda
	searchInput.addEventListener('input', findProduct);

	//Agregar un curso cuando se da clic 
	listaProductos.addEventListener('click', agregarCurso);

	//Elimina los cursos con el boton X
	carrito.addEventListener('click', eliminarCurso);

    articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];

    //Cargar HTML
    carritoHTML();

	//Vaciar el carrito
	vaciarCarritoBtn.addEventListener('click', ()=>
	{
		articulosCarrito = [];//Reseteamos el arreglo

		//Eliminamos el html usando una funcion ya creada
		limpiarHTML();
	});

};


//Funciones

//Iniciado desde evento 'input' pasado al input de texto
function findProduct()
{	
	const productInputName = searchInput.value.toLowerCase().trim();
	const cards = Array.from(tarjeta);

	const findedProducts = cards.filter(producto =>
	{
		return producto.querySelector('h4').textContent.toLowerCase().trim().includes(productInputName);
	});

	listProducts(findedProducts)
}

//llega la tarjeta html
function listProducts(products)
{	
	const tempDiv = document.createElement('div');
	const row = document.querySelector('#row-search-products');

	//limpiar html y lista anterior
	while(row.firstChild) 
	{
		row.removeChild(row.firstChild);
		listaProductos.style.display = 'none';
	}

	//verificar si esta mostrando algun producto o sino poner mensaje
	if(products.length === 0)
	{
		tempDiv.innerHTML = `<h1 id="noResults" class="encabezado">NO HAY COINCIDENCIAS</h1>`;
		row.appendChild(tempDiv);
	}

	//Validar las coincidencias y incrustar el html con las busquedas
	if(products)
	{	

		if(searchInput.value === '')
		{
			containerSearchProducts.style.display = 'none';
			listaProductos.style.display = 'block';
		}
		else
		{
			containerSearchProducts.style.display = 'block';

			products.forEach( product =>
			{
				tempDiv.innerHTML +=  `
							<div class="four columns">
								<div class="card">
									<img
										src="${product.querySelector('img').src}"
										class="imagen-curso u-full-width" />
									<div class="info-card">
										<h4>${product.querySelector('h4').textContent}</h4>
										<p>${product.querySelector('p').textContent}</p>
										<img src="${product.querySelector('.info-card img').src}" />
										<p class="precio">${product.querySelector('.info-card p').textContent} <span class="u-pull-right">${product.querySelector('.info-card span').textContent}</span></p>
										<a href="#" class="u-full-width button input agregar-carrito" data-id="1">Agregar Al Carrito</a>
									</div>
								</div>
							</div>
						`;

				row.appendChild(tempDiv);
			});
		}
	}
}

function darkToggle()
{
    darkMode.addEventListener('click', ()=>
    {
        const body = document.querySelector('body');
        const encabezado = document.querySelector('#encabezado');
        const tarjeta = document.querySelectorAll('.info-card');
        const listaP = document.querySelector('#carrito');
        
        body.style.backgroundColor = 'black';
        encabezado.style.color = 'white';

        tarjeta.forEach( card =>
        {
            card.style.backgroundColor = '#676d70';
        });

        listaP.style.backgroundColor = '#676d70';
        vaciarCarritoBtn.style.color = 'white';

        const bodyStyles = window.getComputedStyle(body);

        if(bodyStyles.backgroundColor === 'rgb(0, 0, 0)')
        {
            body.style.backgroundColor = 'white';
            encabezado.style.color = 'black';

            tarjeta.forEach( card =>
            {
                card.style.backgroundColor = 'white';
            });

            listaP.style.backgroundColor = 'white';
            vaciarCarritoBtn.style.color = '#555';
        }
    })
}

function agregarCurso(e)
{
	e.preventDefault();

	if (e.target.classList.contains('agregar-carrito'))
	{
		//Vamos de un hijo a un padre con esta variable
		const cursoSeleccionado = e.target.parentElement.parentElement;

		leerDatos(cursoSeleccionado);
	};
};

function eliminarCurso(e) 
{
	if (e.target.classList.contains('borrar-curso')) 
	{
		//Obtener el id del curso
		const cursoId = e.target.getAttribute('data-id');

		//Eliminarlo						Nos trae el que no tenga esa id
		articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);

		//Se vuelve a llamar el creador del HTML para actualizar la lista
		carritoHTML();
	};
}


function leerDatos(curso)
{
	const infoCurso =
	{
		imagen: curso.querySelector('img').src,
		titulo: curso.querySelector('h4').textContent,
		precio: curso.querySelector('.precio span').textContent,
		id: curso.querySelector('a').getAttribute('data-id'),
		cantidad: 1
	}

	//Verificacion si existe un curso o no
	const existe = articulosCarrito.some(curso => curso.id === infoCurso.id);

	if (existe)
	{
		//Aumentar la cantidad, el map necesita retornar el objeto actualizado
		const cursos = articulosCarrito.map(curso =>
		{
			if (curso.id === infoCurso.id)
			{
				curso.cantidad++;
				return curso;//Retorna objeto actualizado
			}
			else 
			{
				return curso;//Retorna objetos por default 
			};
		});

		articulosCarrito = [...cursos];
	}
	else 
	{
		//Agregar elementos al carrito de compra
		/*Se usa el spread para no perder los cursos ya guardados, se crea una
		copia del arreglo anterior*/
		articulosCarrito = [...articulosCarrito, infoCurso];
	}

	carritoHTML();
};


//Muestra el carrito con los productos en HTML
function carritoHTML()
{
	//Limpiar el html antes de agregar mas articulos
	limpiarHTML();

	articulosCarrito.forEach(curso =>
	{
		const {imagen, titulo, precio, cantidad, id} = curso;
		const row = document.createElement('tr');
		row.innerHTML =
		`
			<td>
				<img src="${imagen}" width = '150px'>
			</td>
			<td>	
				${titulo}
			</td>
			<td>	
				${precio}
			</td>
			<td>	
				${cantidad}
			</td>
			<td>	
				<a href="#" class="borrar-curso" data-id="${id}"> X </a>
			</td>
		`	

		//Agregar al HTML
		contenedorCarrito.appendChild(row);
	});

    sincronizarStorage();
};

function sincronizarStorage()
{
	localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}


//Debemos eliminar el html que se repite en el carrito de compras
function limpiarHTML() 
{
	//Forma lenta de limpiar
	//contenedorCarrito.innerHTML = '';

	//Ciclo que se ejecuta mientras el carrito tenga cursos
	while (contenedorCarrito.firstChild) 
	{
		contenedorCarrito.removeChild(contenedorCarrito.firstChild);
	}
};
});