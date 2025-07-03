import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gnsmmiclqsivikdfmkkm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imduc21taWNscXNpdmlrZGZta2ttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1Njc5ODcsImV4cCI6MjA2NzE0Mzk4N30.GakJGB1AUPG1uiVSWIQOpTFuyzpVJvgh7th4rmkIdiE'
const supabase = createClient(supabaseUrl, supabaseKey)

// Elementos da página
const listaProdutos = document.getElementById("lista-produtos")
const searchInput = document.getElementById("search")

// Carregar todas as lojas (ou produtos, se mudar a lógica)
async function carregarProdutos() {
  const { data, error } = await supabase.from("lojas").select("*")
  if (error) {
    console.error("Erro ao buscar lojas:", error.message)
    return
  }
  exibirProdutos(data)
}

// Exibir as lojas na tela
function exibirProdutos(lista) {
  listaProdutos.innerHTML = ""
  lista.forEach(prod => {
    const card = `<div class="card-produto">
      <h3>${prod.nome}</h3>
      <p><strong>Endereço:</strong> ${prod.endereco}</p>
      <p><strong>Categoria:</strong> ${prod.categoria_produto}</p>
      <p><strong>Telefone:</strong> ${prod.telefone}</p>
      <p><strong>CNPJ:</strong> ${prod.cnpj}</p>
    </div>`
    listaProdutos.innerHTML += card
  })
}

// Filtrar lojas por categoria
async function filtrarCategoria(categoria) {
  const { data, error } = await supabase
    .from("lojas")
    .select("*")
    .eq("categoria_produto", categoria)

  if (error) {
    console.error("Erro ao filtrar:", error.message)
    return
  }
  exibirProdutos(data)
}

// Busca por texto
searchInput.addEventListener("input", async () => {
  const termo = searchInput.value.toLowerCase()
  const { data, error } = await supabase.from("lojas").select("*")
  if (error) return

  const filtrados = data.filter(p =>
    p.nome.toLowerCase().includes(termo) ||
    p.endereco.toLowerCase().includes(termo) ||
    p.categoria_produto.toLowerCase().includes(termo)
  )
  exibirProdutos(filtrados)
})

// Abrir/fechar modal
function abrirCadastro() {
  document.getElementById('modalCadastro').style.display = 'flex'
}
function fecharCadastro() {
  document.getElementById('modalCadastro').style.display = 'none'
}

// Cadastrar nova loja
async function enviarCadastro() {
  const nome = document.getElementById('nomeLoja').value.trim()
  const endereco = document.getElementById('enderecoLoja').value.trim()
  const categoria = document.getElementById('categoriaLoja').value
  const telefone = document.getElementById('telefoneLoja').value.trim()
  const cnpj = document.getElementById('cnpjLoja').value.trim()
  const senha = document.getElementById('senhaLoja').value.trim()

  if (nome && endereco && categoria && telefone && cnpj && senha) {
    const { error } = await supabase.from("lojas").insert([{
      nome,
      endereco,
      categoria_produto: categoria,
      telefone,
      cnpj,
      senha
    }])
    if (error) {
      alert("Erro ao cadastrar loja: " + error.message)
    } else {
      alert("Loja cadastrada com sucesso!")
      fecharCadastro()
      carregarProdutos()
    }
  } else {
    alert("Por favor, preencha todos os campos.")
  }
}

// Tornar funções acessíveis no HTML  
window.abrirCadastro = abrirCadastro
window.fecharCadastro = fecharCadastro
window.enviarCadastro = enviarCadastro
window.filtrarCategoria = filtrarCategoria

// Carregar lojas ao iniciar
carregarProdutos()
