import CardLoading from '@/components/CardLoading'
import Card from '@/components/Card'
import Navbar from '@/components/Navbar'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { localSave } from '@/Functions/LocalStorage'


export default function Home() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const localCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(localCart)
  }, [])

  const getProducts = (title) => {
    setLoading(true)
    fetch('https://dummyjson.com/products')
      .then(res => res.json())
      .then((res) => {
        setLoading(false)
        if (title) {
          const filter = res.products.filter((e) => { return (e.category.toLowerCase().includes(title.toLowerCase()) || e.title.toLowerCase().includes(title.toLowerCase())) })
          setProducts(filter)
          return;
        }
        setProducts(res.products)

      })
      .catch(() => {
        console.log('err')
      })
  }

  useEffect(() => {
    getProducts();
  }, [])

  useEffect(() => {
    setProducts([])
    getProducts(searchQuery);
  }, [searchQuery])

  const handleAddToCart = (item) => {
    const find = cart.findIndex((e) => e.title === item.title);
    if (find === -1) {
      setCart(element => [item, ...element]);
    }
    return;
  }

  useEffect(() => {
    if(cart.length > 0){
      localSave(cart)
    }
  }, [cart])

  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="favicon.ico" />
      </Head>

      <main className='w-100 flex flex-col box-border'>
        <Navbar cart={cart} setSearchQuery={setSearchQuery} />
        <div className='w-full px-2 md:px-4 pb-10 mt-24 md:mt-20 gap-5 gap-y-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {products && products.length > 0 ?
            products.map((data, i) => {
              return (
                <Card data={data} handleAddToCart={handleAddToCart} key={i} />
              )
            })
            :
            loading
              ?
              <>
                <CardLoading />
                <CardLoading />
                <CardLoading />
                <CardLoading />
              </>
              :
              <span className='absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 font-medium'>No Item Found</span>
          }
        </div>
      </main>
    </>
  )
}
