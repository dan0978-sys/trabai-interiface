# 📅 Agenda+

Aplicação web de organização pessoal com calendário mensal em formato de planilha, gestão de períodos, metas com acompanhamento de progresso, alarmes sonoros e painel completo de acessibilidade (WCAG 2.2 AA).

> **Contexto:** Projeto Final de Desenvolvimento de Interfaces — desenvolvido como uma *Single-Page Application* (SPA) autónoma em ficheiro único (`Agenda.html`), sem necessidade de servidor ou dependências externas de *build*.

---

## ✨ Funcionalidades Principais

### 🗓️ Múltiplas Visualizações de Agenda
* **Mês (Calendário tipo planilha):**
  * Seleção de um ou vários dias ao clicar e arrastar com o rato ou usar `Shift + Setas`.
  * **Edição direta na célula:** basta selecionar um dia (ou fazer duplo clique) e começar a digitar. O sistema reconhece horários automaticamente no formato `14:30 Reunião` ou `14h30 Reunião`.
  * **Arrastar e largar (*Drag & Drop*):** mova compromissos entre dias ou mantenha `Ctrl` / `Alt` pressionado para duplicar.
  * **Atalhos de teclado:** suporte completo para copiar, recortar, colar, desfazer e concluir em lote.
* **Dia:** Lista organizada com separação para tarefas **Atrasadas**, barra de progresso diária e marcação rápida de conclusão.
* **Semana:** Visão consolidada dos 7 dias da semana com resumo de disponibilidade.
* **Metas:** Gestão de objetivos **anuais**, **mensais** e **semanais** com barras de progresso ajustáveis de `0%` a `100%`.

### 🏷️ Categorias e Períodos
* **Categorias com código de cores:** *Trabalho*, *Pessoal*, *Estudos*, *Saúde* e *Outros*, com filtro rápido na barra lateral e contador de pendências.
* **Períodos:** Destaque visual para intervalos de datas (como *Prova*, *Trabalho*, *Viagem* ou *Outro*) diretamente nas células do mês e em faixas informativas nas vistas diária e semanal.

### 🔔 Alarmes e Notificações
* Lembretes configuráveis (*Na hora*, *5 min antes*, *15 min antes*, *1 h antes* ou *1 dia antes*; compromissos sem hora definida disparam às `09:00`).
* Alerta sonoro sintetizado via **Web Audio API**, integração com a **Notifications API** do navegador e opção de **Soneca de 10 min**.

### 🔍 Pesquisa Global
* Página dedicada (`#pesquisar`) com filtragem instantânea por separadores: **Compromissos**, **Metas**, **Períodos** e **Recursos**.

### ♿ Acessibilidade (WCAG 2.2 AA)
* **Preferências persistentes:** Modo claro/escuro (com deteção automática do sistema), ajuste de tamanho da fonte (`80%` a `160%`), **Alto contraste**, fonte de alta legibilidade (*Atkinson Hyperlegible*), **Espaçamento ampliado** e **Reduzir animações**.
* **Auditoria ao vivo:** Tabela dinâmica na página de Acessibilidade que calcula em tempo real a razão de contraste (AA e AAA) entre os pares de cores do tema ativo, acompanhada da paleta e psicologia das cores.
* **Navegação inclusiva:** Link para saltar diretamente para o conteúdo (`Pular para o conteúdo`), navegação por teclado e atributos ARIA semânticos.

### 🔐 Autenticação e Contacto (Demonstração Local)
* Registo e início de sessão simulados no navegador com encriptação de palavra-passe via **Web Crypto API (`SHA-256`)**.
* Formulário de contacto com validação acessível e armazenamento local das mensagens.

---

## ⌨️ Atalhos de Teclado (Vista Mensal)

| Atalho | Ação |
| :--- | :--- |
| `Setas Direcionais` | Navegar entre os dias do calendário |
| `Shift + Setas` | Selecionar um intervalo de dias |
| `Digitar texto` / `Enter` / `F2` | Criar novo compromisso diretamente no(s) dia(s) selecionado(s) |
| `Ctrl + C` / `Cmd + C` | Copiar compromissos do intervalo selecionado |
| `Ctrl + X` / `Cmd + X` | Recortar compromissos do intervalo selecionado |
| `Ctrl + V` / `Cmd + V` | Colar compromissos a partir do dia selecionado |
| `Ctrl + Z` / `Cmd + Z` | Desfazer a última alteração |
| `Delete` / `Backspace` | Limpar compromissos do intervalo selecionado |
| `Esc` | Cancelar edição ou limpar seleção múltipla |

---

## 🛠️ Tecnologias e APIs Utilizadas

* **HTML5 & CSS3:** Layout responsivo com CSS Grid e Flexbox, variáveis CSS (`Custom Properties`), função `color-mix()` e suporte nativo a temas claro/escuro.
* **JavaScript (ES6+ Vanilla):** Roteamento baseado em *hash* (`#inicio`, `#agenda`, `#pesquisar`, `#acessibilidade`, `#contato`, `#entrar`), gestão de estado e histórico de ações (*Undo*).
* **Tipografia (Google Fonts):** *Bricolage Grotesque*, *Instrument Sans* e *Atkinson Hyperlegible*.
* **APIs Nativas do Navegador:**
  * `localStorage` — Persistência local dos dados (`agenda.v1`, `agenda.p1`, `agenda.g1`, `agenda.a11y`, `agenda.users`, `agenda.s`, `agenda.msgs`).
  * `Web Audio API` — Geração de sinal sonoro para os alarmes sem ficheiros de áudio externos.
  * `Notifications API` — Notificações nativas no sistema operativo.
  * `Web Crypto API` — Geração de *hash* `SHA-256` para palavras-passe.

---

## 🚀 Como Executar

Como todo o código está encapsulado num único ficheiro sem dependências de compilação:

1. **Clone ou descarregue o repositório:**
   ```bash
   git clone [https://github.com/seu-usuario/agenda-plus.git](https://github.com/seu-usuario/agenda-plus.git)
   ```
2. **Abra o ficheiro no navegador:**
   * Dê duplo clique em `Agenda.html`, **ou**
   * Utilize uma extensão como o **Live Server** (VS Code) para servir o ficheiro localmente (recomendado para testar notificações do navegador).

---

## 📂 Estrutura do Projeto

```text
├── Agenda.html    # Aplicação completa (estrutura HTML, estilos CSS e lógica JS)
└── README.md      # Documentação do projeto
```

---

## 📝 Licença

Este projeto foi desenvolvido para fins académicos e de demonstração. Sinta-se à vontade para estudar, adaptar e evoluir o código.
