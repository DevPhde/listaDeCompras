import { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import { VerticalModal } from '../Components/VerticalModal';
import { AxiosProvider } from '../Axios/AxiosProvider';
// import { BackdropModal } from '../Components/BackdropModal';
import { Product } from '../Entities/Product';
import Button from 'react-bootstrap/Button';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import "../Styles/home.css";

export default function Home() {
    // Vertical Modal
    const [showModal, setShowModal] = useState(false)
    const handleVerticalModal = () => {
        setShowModal(false)
        setIsValid({ name: true, quantidade: true })
        setCreatedProduct(false)
        setDeletedProduct(false)
    }
    // backDropModal
    // const [error, setError] = useState(false)

    //Button
    const [isLoadingButton, setLoadingButton] = useState(false);
    const handleClick = () => {
        setLoadingButton(true);
        handleCreateProduct();
        setCreatedProduct(false)
        setDeletedProduct(false)
    }

    //Form
    const [values, setValues] = useState({
        nome: '',
        quantidade: 1,
    });
    const [isValid, setIsValid] = useState({
        nome: true,
        quantidade: true
    })

    // //create Product

    const handleCreateProduct = async () => {
        let isValid = true;

        if (!values.nome || values.nome.length < 3) {
            setIsValid(prevState => ({ ...prevState, nome: false }));
            isValid = false;
        }
        if (!values.quantidade || values.quantidade < 0) {
            setIsValid(prevState => ({ ...prevState, quantidade: false }));
            isValid = false;
        }
        if (isValid) {
            try {
                const product = new Product(values.nome, values.quantidade);

                const response = await AxiosProvider.communication("POST", "", product);
                if (response.status == 201) {
                    setShowModal(false);
                    setCreatedProduct(true);
                    setUpdateTable(updateTable + 1);
                }
            } catch (e) {
                setError(true);
            }
        }

        setLoadingButton(false)
    }

    // new product Message
    const [createdProduct, setCreatedProduct] = useState(false)

    //Table Control
    const [updateTable, setUpdateTable] = useState(0)
    const [tableData, setTableData] = useState([])
    //fetch Data
    useEffect(() => {
        async function getData() {
            try {
                const response = await AxiosProvider.communication('GET')
                setTableData(response.data)
            } catch (err) {
                setError(true)
            }
        }
        getData()
    }, [updateTable])

    //Delete Product
    const [deletedProduct, setDeletedProduct] = useState(false)
    const [productDelete, setProductDelete] = useState({
        delete: false,
        key: 0,
        nome: ""
    })
    const handleDelete = (i) => {
        setProductDelete({ delete: true, key: i.id, nome: i.nome })
        setCreatedProduct(false)
        setDeletedProduct(false)
    }
    const handleDeleteRow = async () => {
        const response = await AxiosProvider.communication("DELETE", `/${productDelete.key}`)
        setProductDelete({ delete: false, key: 0, nome: "" })
        setUpdateTable(updateTable + 1)
        setDeletedProduct(true)
    }
    //Filter

    //Name
    const [nameSortOrder, setNameSortOrder] = useState(null);
    const handleNameSort = () => {
        if (nameSortOrder === null || nameSortOrder === 'desc') {
            const sortedTableData = [...tableData].sort((a, b) => a.nome.localeCompare(b.nome))
            setTableData(sortedTableData)
            setNameSortOrder('asc')
        } else {
            const sortedTableData = [...tableData].sort((a, b) => b.nome.localeCompare(a.nome))
            setTableData(sortedTableData)
            setNameSortOrder('desc')
        }
    }

    return (
        <main>
            {/* {error && (<BackdropModal
                title="Erro Interno"
                message="Reinicie a aplicação e tente novamente."
                namebutton="Fechar"
            />)} */}
            <VerticalModal
                show={showModal}
                onHide={handleVerticalModal}
                title={'Adicionar Produto'}
                namebutton={"Fechar"}
                message={(
                    <>
                        <section className=''>
                            <h4 className="text-center mt-5 my-3">Cadastrar Produto</h4>

                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="floatingInput" onBlur={(event) => { event.target.value == "" || event.target.value.length < 3 ? setIsValid(prevState => ({ ...prevState, nome: false })) : setIsValid(prevState => ({ ...prevState, nome: true })) }}
                                    onChange={(event) => setValues((prevState) => ({ ...prevState, nome: event.target.value }))} value={values.nome} />
                                <label htmlFor="floatingInput">Nome</label>
                            </div>
                            {!isValid.nome && <p className="text-danger">Preencha o campo NOME com pelo menos 3 caracteres.</p>}

                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="floatingInput" onBlur={(event) => { event.target.value == "" || event.target.value < 1 ? setIsValid(prevState => ({ ...prevState, quantidade: false })) : setIsValid(prevState => ({ ...prevState, quantidade: true })) }}
                                    onChange={(event) => setValues((prevState) => ({ ...prevState, quantidade: event.target.value }))} value={values.quantidade} />
                                <label htmlFor="floatingInput">Quantidade</label>
                            </div>
                            {!isValid.quantidade && <p className="text-danger">Preencha o campo QUANTIDADE com pelo menos 1 valor.</p>}

                            <div className='text-center mt-5'>
                                <Button
                                    variant="primary"
                                    disabled={isLoadingButton}
                                    onClick={!isLoadingButton ? handleClick : null}
                                >
                                    {isLoadingButton ? 'Carregando...' : 'Cadastrar'}
                                </Button>
                            </div>
                        </section>
                    </>)} />
            <div className='text-center my-5'>
                <button className='btn btn-success' onClick={() => {
                    setShowModal(true)
                    setValues({ nome: "",  quantidade: 0})
                }}>Cadastrar novo produto</button>
            </div>

            <VerticalModal
                show={productDelete.delete}
                onHide={() => {
                    setProductDelete(prevState => ({ ...prevState, delete: false, key: 0, nome: "" }))
                    setDeletedProduct(false)
                    setCreatedProduct(false)
                }}
                title={"Deletar Produto"}
                anotherbutton={+true}
                classanotherbutton={"btn table-modal-btn btn-danger"}
                clickanotherbutton={() => handleDeleteRow()}
                anotherbuttonmessage={"Deletar"}
                namebutton={"Cancelar"}
                message={
                    <>
                        <p>Tem certeza que deseja deletar o produto "{productDelete.nome}"?</p>
                    </>
                }
            />


            <div>
                {createdProduct && <p className='text-center text-success'>Produto cadastrado com sucesso!</p>}
                {/* {deletedProduct && <p className='text-center text-danger'>Produto deletado com sucesso!</p>} */}
                {tableData.length != 0 ? (<div>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th className='text-center'><button onClick={handleNameSort} className='btn fw-bold'>Nome{nameSortOrder === 'asc' ? '↓' : nameSortOrder === 'desc' ? '↑' : ''}</button></th>
                                <th className='text-center th-quantidade'>Quantidade</th>
                                <th className='pb-3 text-center'>Opções</th>
                            </tr>
                        </thead>


                        {tableData.map((info) => (
                            <tbody key={info.id}>
                                <tr>
                                    <td>{info.nome}</td>
                                    <td className='text-center'>{info.quantidade}</td>
                                    <td className="text-center"><button onClick={() => handleDelete(info)} type="button" className="btn ms-1 p-1 btn-danger">Deletar</button></td>
                                </tr>
                            </tbody>

                        ))}

                    </Table>
                </div>
                ) : (
                    <div>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th><button onClick={handleNameSort} className='btn fw-bold'>Nome{nameSortOrder === 'asc' ? '↓' : nameSortOrder === 'desc' ? '↑' : ''}</button></th>
                                    <th className='text-center th-quantidade'>Quantidade</th>
                                    <th className='pb-3'>Opções</th>
                                </tr>
                            </thead>
                        </Table>
                        <p className='text-center mt-3'>Nenhum produto cadastrado.</p>
                    </div>)}



            </div>
        </main>
    )
}