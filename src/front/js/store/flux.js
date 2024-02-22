import { toast } from "react-toastify"

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			/* ACA VA MI CODIGO */
			user: null,
			access_token: null,
			apiURL: 'https://reimagined-couscous-pjjgxg565j6rf6gvq-3001.app.github.dev',
			name: '',
			email: '',
			password: '',
			password_confirm: '',
			is_active: true,

		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},
			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},

			/* Aca va mi codigo */
			handleSubmitRegister: e => {
				e.preventDefault()
				const { name, email, password, is_active, password_confirm, apiURL } = getStore()
				if (password == password_confirm) {
					const { getFetch } = getActions()
					const url = `${apiURL}/api/register`
					const raw = JSON.stringify({
						name, email, password, is_active
					})
					const options = {
						method: 'POST',
						body: raw,
						headers: {
							'Content-Type': 'application/json'
						}
					}

					const request = getFetch(url, options)
					request.then((response) => response.json()).then((datos) => {
						console.log(datos)
						if (datos.msg) {
							toast.error(datos.msg)
						} else {

							toast.success(datos.success)
							setStore({
								name: '',
								email: '',
								password: '',
								password_confirm: '',
								active: true,
							})
						}

					}).catch(error => console.log(error))

				}
				else {
					toast.error('passwords must be the same')
				}

			},

			handleChange: e => {
				const { name, value } = e.target
				setStore({
					[name]: value
				})
			},
			handleSubmitLogin: e => {
				e.preventDefault()
				const { email, password, apiURL } = getStore()
				const { getFetch } = getActions()

				// creo la url a acceder
				const url = `${apiURL}/api/login`

				// Transformo los datos en string
				const raw = JSON.stringify({
					email, password
				})

				// creo las opciones de la peticion (request)
				const options = {
					method: 'POST',
					body: raw,
					headers: {
						'Content-Type': 'application/json'
					}
				}
				const request = getFetch(url, options)
				request.then((response) => response.json()).then((datos) => {
					console.log(datos)

					if (datos.msg) {
						toast.error(datos.msg)
					} else {
						toast.success(datos.success)
						setStore({
							email: '',
							password: '',
							access_token: datos.access_token,
							user: datos.user
						})
						sessionStorage.setItem('access_token', datos.access_token)
						sessionStorage.setItem('user', JSON.stringify(datos.user))
					}
				}).catch(error => console.log(error))

			},

			getFetch: (url, options) => {
				return fetch(url, options)
			},
			logout: () => {
				setStore({
					user: null,
					access_token: null
				})
				sessionStorage.removeItem('user')
				sessionStorage.removeItem('access_token')
			},

			checkCurrentUser: () => {
				if (sessionStorage.getItem('access_token')) {
					setStore({
						access_token: sessionStorage.getItem('access_token'),
						user: JSON.parse(sessionStorage.getItem('user'))
					})
				}
			}
		}
	};
};

export default getState;
