# Área do Cliente - FrontStay

## 📋 Estrutura Criada

### Páginas de Autenticação

- **Login**: `/login` - Tela de login com seleção de perfil
  - Hóspede 🏨
  - Proprietário 🏠
  - Administrador ⚙️
  - Parceiros 🤝

### Dashboards por Perfil

Cada perfil tem seu próprio dashboard personalizado:

1. **Hóspede** - `/dashboard/hospede`
   - Visualização de reservas ativas
   - Busca de imóveis
   - Gerenciamento de favoritos
   - Histórico de reservas

2. **Proprietário** - `/dashboard/proprietario`
   - Gestão de imóveis
   - Controle de reservas
   - Métricas de ocupação
   - Relatórios financeiros

3. **Administrador** - `/dashboard/administrador`
   - Visão geral da plataforma
   - Gestão de usuários
   - Aprovação de imóveis
   - Relatórios gerais

4. **Parceiros** - `/dashboard/parceiros`
   - Gestão de serviços
   - Solicitações de trabalho
   - Avaliações
   - Relatórios financeiros

## 🚀 Como Usar

### Para testar a aplicação:

1. Instale as dependências (se ainda não instalou):
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

3. Acesse a tela de login:
```
http://localhost:3000/login
```

4. Selecione um perfil e faça login (atualmente simulado)

### Navegação Direta para Dashboards:

- Hóspede: `http://localhost:3000/dashboard/hospede`
- Proprietário: `http://localhost:3000/dashboard/proprietario`
- Administrador: `http://localhost:3000/dashboard/administrador`
- Parceiros: `http://localhost:3000/dashboard/parceiros`

## 🔧 Próximos Passos

Para implementar autenticação real:

1. **Integrar com backend de autenticação** (NextAuth.js, Firebase, etc.)
2. **Adicionar proteção de rotas** - Middleware para verificar autenticação
3. **Implementar lógica de registro** - Cadastro de novos usuários
4. **Adicionar recuperação de senha**
5. **Criar contexto de usuário** - Gerenciamento de estado global
6. **Conectar com API real** - Substituir dados mockados

## 📁 Estrutura de Arquivos

```
src/
├── types/
│   └── user.ts              # Tipos TypeScript para usuários
├── app/
    ├── login/
    │   └── page.tsx         # Página de login
    └── dashboard/
        ├── hospede/
        │   └── page.tsx     # Dashboard do hóspede
        ├── proprietario/
        │   └── page.tsx     # Dashboard do proprietário
        ├── administrador/
        │   └── page.tsx     # Dashboard do administrador
        └── parceiros/
            └── page.tsx     # Dashboard dos parceiros
```

## 🎨 Recursos Implementados

- ✅ Interface moderna e responsiva com TailwindCSS
- ✅ Seleção visual de perfil com ícones
- ✅ Validação de formulário
- ✅ Estados de carregamento
- ✅ Navegação entre páginas
- ✅ Design consistente entre dashboards
- ✅ Cards informativos com métricas
- ✅ Ações rápidas personalizadas por perfil
