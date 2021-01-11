import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import '../css/Menu.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { getQueriesForElement } from '@testing-library/react';
import ReactHtmlParser from 'react-html-parser';

import axios from 'axios';

function Menu(props) {

    const cookies = new Cookies();
    const baseUrl = "http://18.220.90.91:61247/api/usuarios";
  //  const baseUrl = "https://localhost:44322/api/usuarios";
    const [data, setData] = useState([]);
    const [dataPost, setDataPost] = useState([]);
    const cerrarSesion = () => {
        cookies.remove('id', { path: '/' });
        cookies.remove('apellido_paterno', { path: '/' });
        cookies.remove('apellido_materno', { path: '/' });
        cookies.remove('nombre', { path: '/' });
        cookies.remove('correo', { path: '/' });
        cookies.remove('username', { path: '/' });
        cookies.remove('password', { path: '/' });
        props.history.push('./');
    }
    const [modalEditar, setModalEditar] = useState(false);
    const [modalInsertar, setModalInsertar] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);
    const [usuarioSeleccionado, setUsuarioSelecionado] = useState({
        id: '',
        apellido_paterno: '',
        apellido_materno: '',
        nombre: '',
        correo: '',
        username: '',
        cat: '',
        edad: '',
        cargo: '',
        password: '',
    });
    const handleChange = e => {
        const { name, value } = e.target;
        setUsuarioSelecionado({
            ...usuarioSeleccionado,
            [name]: value
        })
        console.log(usuarioSeleccionado);
    }
    const abrirCerrarModal = () => {
        setModalInsertar(!modalInsertar);
    }
    const abrirCerrarModalEditar = () => {
        setModalEditar(!modalEditar);
    }

    const abrirCerrarModalEliminar = () => {
        setModalEliminar(!modalEliminar);
    }
    useEffect(() => {
        if (!cookies.get('id')) {
            props.history.push('./');
        }
        getUser();
        getPost()
    }, []);
    const getUser = async () => {
        await axios.get(baseUrl)
            .then(response => {
                setData(response.data);
            }).catch(error => {
                console.log(error);
            })
    }
    const getPost = async () => {
        await axios.get("http://cstcolombia.net/HelloWorld/wp-json/wp/v2/posts/")
            .then(response => {
                setDataPost(response.data);
                console.log(response.data);
            }).catch(error => {
                console.log(error);
            })
    }
    const seleccionarUsuario = (usuario, caso) => {
        setUsuarioSelecionado(usuario);
        (caso === "Editar") ?
            abrirCerrarModalEditar() :
            abrirCerrarModalEliminar();
    }
    const newUser = async () => {
        delete usuarioSeleccionado.id;
        await axios.post(baseUrl, usuarioSeleccionado)
            .then(response => {
                setData(data.concat(response.data));
                abrirCerrarModal();
            }).catch(error => {
                console.log(error);
            });
    }
    const editUser = async () => {
        usuarioSeleccionado.id = parseInt(usuarioSeleccionado.id);
        await axios.post(baseUrl + "/PutUsuarios/" + usuarioSeleccionado.id, usuarioSeleccionado,{
     headers: {'Content-Type': 'application/json'}
 })
            .then(response => {
                var resp = response.data;
                var Aux = data;
                console.log(response);
                Aux.map(gestor => {
                    if (gestor.id == usuarioSeleccionado.id) {
                        gestor.apellido_paterno = resp.apellido_paterno;
                        gestor.apellido_materno = resp.apellido_materno;
                        gestor.nombre = resp.nombre;
                        gestor.correo = resp.correo;
                        gestor.username = resp.username;
                        gestor.cat = resp.cat;
                        gestor.edad = resp.edad;
                        gestor.cargo = resp.cargo;
                        gestor.password = resp.password;
                    }
                });
                abrirCerrarModalEditar();
            }).catch(error => {
                console.log(error);
            });
    }
    const deleteUser = async () => {
        usuarioSeleccionado.id = parseInt(usuarioSeleccionado.id);
        await axios.get(baseUrl + "/DeleteUsuarios/" + usuarioSeleccionado.id, usuarioSeleccionado)
            .then(response => {
                setData(data.filter(gestor => gestor.id !== response.data.id))
                abrirCerrarModalEliminar();
            }).catch(error => {
                console.log(error);
            });
    }
    return (
        <div className="containerMenu">
            <nav className="navbar navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand">
                        <strong className="titlePage">
                            Hello World
                        </strong>
                    </a>
                    <div className="d-flex " >
                        {cookies.get('username')}
                        <button className="btn btn-outline-danger btn-sm" onClick={() => cerrarSesion()}>Logout</button>
                    </div>
                </div>
            </nav>

            <div className="container-fluid">
                <div className="mt-4"> </div>
                <div className="row">
                    <div className="col-sm-12 text-right">
                        <button type="button" className="btn btn-outline-success " onClick={() => abrirCerrarModal()}>Nuevo usuario</button>
                    </div>
                </div>
                <div className="mt-4"> </div>

                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Primer apellido</th>
                            <th>Segundo apellido</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>usuario</th>
                            <th>cat</th>
                            <th>edad</th>
                            <th>cargo</th>
                            <th>acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(gestor => (
                            <tr>
                                <td>{gestor.id}</td>
                                <td><a href="#!" onClick={() => seleccionarUsuario(gestor, "Editar")}>{gestor.apellido_paterno} <i class="far fa-edit"></i></a></td>
                                <td>{gestor.apellido_materno}</td>
                                <td>{gestor.nombre}</td>
                                <td>{gestor.correo}</td>
                                <td>{gestor.username}</td>
                                <td>{gestor.cat}</td>
                                <td>{gestor.edad}</td>
                                <td>{gestor.cargo}</td>
                                <td><a href="#!" className="mr-2" title="Editar" onClick={() => seleccionarUsuario(gestor, "Editar")}><i class="fas fa-user-edit"></i></a><a href="#!" className="mr-2" title="Eliminar" onClick={() => seleccionarUsuario(gestor, "Eliminar")}><i class="far fa-trash-alt"></i></a> </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mt-5"></div>
                <div className="row">
                    <div className="col-sm-12">
                        <h5>Ultimos Post</h5>
                    </div>
                    <div className="clearfix"> </div>
                    {dataPost.map(post => (
                        <div className="col-sm-4 text-left">
                            <div className="post">

                                <strong>{post.title.rendered}</strong>
                                <div className="clearfix"> </div>
                                <span className="datePublish">publicado el dia: {post.date}</span>
                                <div>{ReactHtmlParser(post.content.rendered)}</div>
                                <div>Referencia: <a href={post.link}>Visitar Post Completo</a></div>
                            </div>
                        </div>
                    ))}
                                <div className="mt-5"></div>
                                <div className="mt-5"></div>

                </div>


                {/*
                <br />
                <br />
                <h5>ID: </h5>
                <br />
                <h5>Apellido Paterno: {cookies.get('apellido_paterno')}</h5>
                <br />
                <h5>Apellido Materno: {cookies.get('apellido_materno')}</h5>
                <br />
                <h5>Nombre: {cookies.get('nombre')}</h5>
                <br />
                <h5>Correo: {cookies.get('correo')}</h5>
                <br />
                <h5>Username: </h5>
                <br />
                <h5>Password: {cookies.get('password')}</h5>
                <br />
                */}
            </div>
            <Modal isOpen={modalInsertar}>
                <ModalHeader> Nuevo usuario </ModalHeader>
                <ModalBody>
                    <div>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Primer Apellido" name="apellido_paterno" onChange={handleChange} />

                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Segundo Apellido" name="apellido_materno" onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Nombre" name="nombre" onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Correo" name="correo" onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Cat" name="cat" onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Edad" name="edad" onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Cargo" name="cargo" onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Usuario" name="username" onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Password" name="password" onChange={handleChange} />
                        </div>
                        <button onClick={() => newUser()} className="btn btn-outline-success">Crear Nuevo Usuario</button>
                    </div>

                </ModalBody>
                <ModalFooter>
                    <button onClick={() => abrirCerrarModal()} className="btn btn-outline-secondary">Cerrar</button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={modalEditar}>
                <ModalHeader> Editar usuario </ModalHeader>
                <ModalBody>
                    <div>
                        <div className="form-group hidden" hidden>
                            <input type="hidden" className="form-control" placeholder="Primer Apellido" name="id" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.id} />
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Primer Apellido" name="apellido_paterno" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.apellido_paterno} />
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Segundo Apellido" name="apellido_materno" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.apellido_materno} />
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Nombre" name="nombre" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.nombre} />
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Correo" name="correo" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.correo} />
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Cat" name="cat" onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Edad" name="edad" onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Cargo" name="cargo" onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Usuario" name="username" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.username} />
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Password" name="password" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.password} />
                        </div>
                        <button onClick={() => editUser()} className="btn btn-outline-success">Editar Usuario</button>
                    </div>

                </ModalBody>
                <ModalFooter>
                    <button onClick={() => abrirCerrarModalEditar()} className="btn btn-outline-secondary">Cerrar</button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={modalEliminar}>
                <ModalHeader> Eliminar usuario </ModalHeader>
                <ModalBody>
                    estas a punto de eliminar un usuario, {usuarioSeleccionado && usuarioSeleccionado.password}. ¿Estas seguro que desea continuar?
                </ModalBody>
                <ModalFooter>
                    <button onClick={() => deleteUser()} className="btn btn-outline-secondary">Eliminar</button>
                    <button onClick={() => abrirCerrarModalEliminar()} className="btn btn-outline-secondary">Cerrar</button>
                </ModalFooter>
            </Modal>
            <div className="mt-5"></div>
           

            <footer className="footer">
                <div className="logoFooter">Hello World</div>
                <strong>Andrés Rojas</strong><br></br>
                <strong>Mobile: </strong><a href="tel:573213989368"> (+57) 321 398-9368</a><br></br>
                <strong>Email: </strong><a href="mailto:AndreRojas566@gmail.com">AndreRojas566@gmail.com</a>
            </footer>
            <div className="mt-5"></div>

        </div>

    );
}

export default Menu;