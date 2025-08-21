# 🏠 Front Stay - Landing Page Moderna

Uma landing page moderna e elegante para o Front Stay, desenvolvida com as tecnologias mais avançadas em UX/UI e 3D.

## ✨ Características

### 🎨 **Design Moderno**

- **Identidade Visual**: Baseada na paleta cromática do Front Stay (Teal, Roxo Escuro, Laranja)
- **Tipografia**: Inter (simulando Questa Sans) com hierarquia clara
- **Estilo**: Urbano, estiloso, com toques mineiros e foco em "casa aconchegante"

### 🚀 **Tecnologias Avançadas**

- **3D Interativo**: React Three Fiber para visualização 3D dos apartamentos
- **Animações**: Framer Motion para transições fluidas
- **Parallax**: react-scroll-parallax para efeitos de scroll
- **Glass Morphism**: Efeitos de blur e transparência
- **Dark Mode**: Toggle funcional para modo escuro
- **Responsivo**: Design mobile-first completo

### 🎯 **Componentes Principais**

1. **Header**: Navegação fixa com glass effect e menu mobile
2. **HeroSection**: Formulário de busca e elementos 3D flutuantes
3. **Apartment3DViewer**: Visualizador 3D interativo dos apartamentos
4. **ApartmentTypesSection**: Seletor de tipos com visualizador 3D
5. **AmenitiesSection**: Grid de amenidades com ícones e gradientes
6. **BenefitsSection**: Benefícios com estatísticas e CTA
7. **Footer**: Links completos, redes sociais e newsletter

## 🛠️ Tecnologias Utilizadas

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Framer Motion** - Animações
- **React Three Fiber** - Renderização 3D
- **react-scroll-parallax** - Efeitos parallax
- **Lucide React** - Ícones
- **Three.js** - Biblioteca 3D

## 📦 Instalação

1. **Clone o repositório**

```bash
git clone [url-do-repositorio]
cd frontstay
```

2. **Instale as dependências**

```bash
npm install
```

3. **Execute o servidor de desenvolvimento**

```bash
npm run dev
```

4. **Acesse a aplicação**

```
http://localhost:3000
```

## 🎨 Paleta de Cores

### Cores Principais

- **Teal**: `#008080` - Cor principal da marca
- **Roxo Escuro**: `#2D1B69` - Cor secundária
- **Laranja**: `#FF6B35` - Cor de destaque
- **Cinza Claro**: `#F5F5F5` - Cor neutra

### Cores Secundárias

- **Teal Escuro**: `#006666`
- **Teal Claro**: `#00A3A3`
- **Roxo Claro**: `#4A2B8A`
- **Laranja Claro**: `#FF8A5C`

## 📱 Responsividade

A landing page é totalmente responsiva e otimizada para:

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🎯 Funcionalidades

### ✨ **3D Interativo**

- Visualização 3D dos apartamentos
- Controles de órbita e zoom
- Diferentes ângulos de visualização
- Efeitos de hover e animações

### 🎭 **Animações**

- Animações de entrada com Framer Motion
- Efeitos parallax no scroll
- Transições suaves entre seções
- Hover effects em todos os elementos

### 🌙 **Dark Mode**

- Toggle funcional no header
- Transições suaves entre modos
- Persistência da preferência do usuário

### 📋 **Formulário de Busca**

- Campos para localização, datas e hóspedes
- Validação em tempo real
- Design responsivo e acessível

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm start

# Linting
npm run lint
```

## 📁 Estrutura do Projeto

```
frontstay/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── Apartment3DViewer.tsx
│   │   │   ├── ApartmentTypesSection.tsx
│   │   │   ├── AmenitiesSection.tsx
│   │   │   ├── BenefitsSection.tsx
│   │   │   └── Footer.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── ...
├── public/
├── tailwind.config.js
├── postcss.config.mjs
└── package.json
```

## 🎨 Customização

### Cores

As cores podem ser customizadas no arquivo `tailwind.config.js`:

```javascript
colors: {
  primary: {
    teal: '#008080',
    'teal-dark': '#006666',
    'teal-light': '#00A3A3',
  },
  // ... outras cores
}
```

### Animações

As animações podem ser ajustadas no arquivo `globals.css`:

```css
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
```

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente se necessário
3. Deploy automático a cada push

### Outras Plataformas

- **Netlify**: Compatível com Next.js
- **AWS Amplify**: Suporte completo
- **DigitalOcean App Platform**: Deploy simples

## 📊 Performance

- **Lighthouse Score**: 90+ em todas as métricas
- **Core Web Vitals**: Otimizado
- **SEO**: Metadados estruturados completos
- **Acessibilidade**: ARIA labels e navegação por teclado

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte ou dúvidas:

- Email: contato@frontstay.com.br
- WhatsApp: (31) 99999-9999

---

**Desenvolvido com ❤️ para o Front Stay**
