# Quebrada Feliz

Projeto em prol das crianças da quebrada.

Repositório: [BRADOCK-LI/QUEBRADA-FELIZ-](https://github.com/BRADOCK-LI/QUEBRADA-FELIZ-).

Site narrativo em português, feito em HTML, CSS e JavaScript, para publicação no GitHub Pages. Sem instalação de pacotes e sem etapa de compilação.

## O que tem no site

- Uma experiência de leitura com três capítulos e índice navegável.
- Design adaptado para celular, tablet e computador.
- Animações que respeitam a preferência por movimento reduzido.
- Menu acessível, tamanho de texto ajustável e progresso de leitura.
- Compartilhamento nativo quando disponível, cópia de link e alternativa manual.
- Conteúdo legível sem JavaScript.

## Conteúdo

O texto inicial é um **conto fictício de demonstração**. Pessoas, acontecimentos e lugar são imaginários. A fotografia é ilustrativa, gerada por inteligência artificial. O próprio site informa isso aos leitores.

Para contar outra história, edite os textos de `docs/index.html`. A aparência fica em `docs/styles.css` e as interações em `docs/script.js`. As imagens e o ícone ficam em `docs/assets/`.

## Publicar pelo GitHub Pages

1. Abra **Settings → Pages** neste repositório.
2. Em **Build and deployment → Source**, selecione **Deploy from a branch**.
3. Selecione a branch **main**, a pasta **/docs** e clique em **Save**.
4. O GitHub publica o site automaticamente e mostra o endereço nessa mesma página.
5. Novos commits em `main` atualizam o site automaticamente.

## Abrir localmente

Na pasta do projeto, execute:

```sh
python3 -m http.server 8000 --directory docs
```

Depois abra `http://localhost:8000`. O site funciona sem backend ou banco de dados. As fontes externas usam Google Fonts, com alternativas locais se não houver conexão.

## Verificações

```sh
node --check docs/script.js
```

## Arquivos

```text
docs/index.html
docs/styles.css
docs/script.js
docs/assets/quebrada-hero.webp
docs/assets/sun.svg
```

Fluxo de publicação baseado na [documentação oficial do GitHub Pages](https://docs.github.com/en/get-started/start-your-journey/deploying-your-website-automatically).
