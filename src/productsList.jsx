import './productsList.module.css'

import { useEffect, useState } from 'react'
import { api } from './api/api'
import { Menu } from './components/menu'
import { useNavigate } from 'react-router'

function ProductsList() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editProductsId, setEditProductsId] = useState(null)
  const [editData, setEditData] = useState({description: '', price: '', image: ''})

  useEffect(() => {
    const storedProducts = localStorage.getItem('product')
    if(!storedProducts) navigate('/')
  }, [navigate])


    const fetchUsers = async () => {
      try {
        const response = await api.get('/products')
        setProducts(response.data)
      } catch (err) {
          setError('Erro ao carregar os produtos', err)
      } finally {
        setLoading(false)
      }
    }

    useEffect(() => {
      fetchUsers()
    }, [])

  const handleDelete = async (id) => {
    try{ 
      await api.delete(`/products/${id}`)
      setProducts(products.filter((p) => p.id !== id))
    }catch (err){
      setError('Erro ao deletar produto', err)
    }
  }

  const handleEditClick = (products) => {
      setEditProductsId(products.id)
      setEditData({description: products.description, price: products.price, image: ''}) //nao mostra senha antiga
  }

  const handleEditChange = (e) => {
    const {description, value} = e.target
    setEditData({...editData, [description]: value})
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      await api.put(`/users/${editProductsId}`, editData)
      setEditProductsId(null)
      fetchUsers()
    }catch (err){
      setError('Erro ao atualizar usuario', err)
    }
  }

  
  if (loading) return <p>Carregando Produtos...</p>
  if (error) return <p>{error}</p>

  return (
    <section>
      <Menu/>
      <div style={{padding:"2rem"}}>
        <h1>Lista de Produtos</h1>
        <ol>
          {products.map((product) => (
            <li key={product.id} style={{marginTop: '2rem', marginLeft: '1rem'}}>
              {editProductsId === product.id ? (
                <form onSubmit={handleUpdate} style={{display: 'flex', flexDirection: 'row', gap: '0.5rem'}}>
                  <input type="text" name='name' value={editData.name} onChange={handleEditChange} required/>
                  <input type="email" name='email' value={editData.email} onChange={handleEditChange} required/>
                  <input type="password" name='password' value={editData.password} onChange={handleEditChange} placeholder='Nova senha'  required/>
                  <button type='submit'>SALVAR</button>
                  <button type='button' onClick={() => setEditProductsId(null)}>CANCELAR</button>
                </form>
              ) : (
                <>
                <strong>{product.description}</strong> - <i>{product.price}</i>
                <div style={{display: 'inline-flex', gap: '0.5rem', marginLeft: '1rem'}}>
                  <button onClick={() => handleEditClick(product)}>EDITAR</button>
                  <button onClick={() => handleDelete(product.id)}>DELETAR</button>
                </div>
                </>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default ProductsList