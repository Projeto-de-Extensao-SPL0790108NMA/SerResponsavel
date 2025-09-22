# CSS Customizado - RespSoc

Este arquivo documenta como usar o sistema de CSS customizado do projeto.

## 📁 Estrutura

```
assets/css/
├── custom.css          # CSS global customizado
└── README.md          # Esta documentação
```

## 🎨 Classes Utilitárias Disponíveis

### **Efeitos Visuais**

```html
<!-- Texto com gradiente -->
<h1 class="text-gradient">Título com Gradiente</h1>

<!-- Efeito glass/vidro -->
<div class="glass-effect">Conteúdo com efeito vidro</div>

<!-- Sombra com brilho -->
<div class="shadow-glow">Card com sombra brilhante</div>
```

### **Animações**

```html
<!-- Fade in com movimento para cima -->
<div class="fade-in-up">Conteúdo animado</div>

<!-- Pulso com brilho -->
<button class="pulse-glow">Botão pulsante</button>
```

### **Botões Customizados**

```html
<!-- Botão com gradiente -->
<button class="btn-gradient">Botão Gradiente</button>
```

### **Responsividade**

```html
<!-- Oculto no mobile -->
<div class="mobile-hidden">Só aparece no desktop</div>

<!-- Oculto no desktop -->
<div class="desktop-hidden">Só aparece no mobile</div>
```

### **Scrollbar Customizada**

```html
<!-- Container com scrollbar estilizada -->
<div class="custom-scrollbar" style="height: 200px; overflow-y: auto;">Conteúdo com scroll...</div>
```

### **Cards com Hover**

```html
<!-- Card que levita no hover -->
<div class="card-hover-effect">Card interativo</div>
```

### **Loading States**

```html
<!-- Skeleton loading -->
<div class="skeleton-loading" style="height: 20px; width: 100%;"></div>
```

## 🔧 Como Adicionar Novos Estilos

### **1. Edite o arquivo custom.css**

```bash
# Caminho do arquivo
app/assets/css/custom.css
```

### **2. Adicione suas classes**

```css
/* Sua nova classe */
.minha-classe-custom {
  /* seus estilos */
}
```

### **3. Use em qualquer componente**

```vue
<template>
  <div class="minha-classe-custom">Conteúdo estilizado</div>
</template>
```

## 💡 Dicas de Uso

### **Combining Classes**

```html
<!-- Combine múltiplas classes -->
<div class="glass-effect shadow-glow fade-in-up">Efeito combinado</div>
```

### **Override Vuetify**

```css
/* No custom.css, você pode sobrescrever Vuetify */
.v-btn.my-custom-btn {
  background: var(--custom-primary) !important;
}
```

### **Variáveis CSS**

```css
/* Use as variáveis definidas */
.meu-elemento {
  color: var(--custom-primary);
  background: var(--custom-secondary);
}
```

## 🎯 Exemplos Práticos

### **Card Animado**

```vue
<template>
  <v-card class="glass-effect card-hover-effect fade-in-up">
    <v-card-title class="text-gradient"> Título Estilizado </v-card-title>
    <v-card-text> Conteúdo do card </v-card-text>
  </v-card>
</template>
```

### **Botão Especial**

```vue
<template>
  <v-btn class="btn-gradient pulse-glow"> Ação Importante </v-btn>
</template>
```

### **Layout Responsivo**

```vue
<template>
  <div>
    <div class="desktop-hidden">
      <v-btn>Menu Mobile</v-btn>
    </div>
    <div class="mobile-hidden">
      <v-navigation-drawer> Menu Desktop </v-navigation-drawer>
    </div>
  </div>
</template>
```

## 🚀 Performance

- ✅ **CSS Puro**: Sem JavaScript desnecessário
- ✅ **Global**: Carregado uma vez para todo o projeto
- ✅ **Otimizado**: Classes reutilizáveis
- ✅ **Tree-shaking**: Unused CSS removido em produção

## 🎨 Customização

Para modificar as cores padrão, edite as variáveis CSS:

```css
:root {
  --custom-primary: #sua-cor;
  --custom-secondary: #sua-cor;
  /* etc... */
}
```

---

**Agora você pode usar essas classes em qualquer componente do projeto!** 🎉
