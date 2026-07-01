const btnGen = document.querySelector(".btn-generate");
const keyInput = document.querySelector(".key-API");
const url = "https://api.groq.com/openai/v1/chat/completions";

btnGen.addEventListener("click", generateCode);

async function generateCode() {
    const textBox = document.querySelector(".text-box");
    const textUser = textBox.value.trim();
    const errorMsg = document.querySelector(".error-msg");
    const resultBox = document.querySelector(".result-box");
    const codeBox = document.querySelector(".code-box");
    const codeResult = document.querySelector(".code-result");
    const apiKey = keyInput.value.trim();

    errorMsg.textContent = '';

    if (!textUser) {
        errorMsg.textContent = 'Digite uma descrição para gerar o CSS.';
        textBox.focus();
        return;
    }

    if (!apiKey) {
        errorMsg.textContent = 'Informe a API key.';
        keyInput.focus();
        return;
    }

    resultBox.style.visibility = 'visible';
    codeBox.textContent = 'Gerando código com  IA...';
    codeResult.srcdoc = '';

    try {
        const resAPI = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: "Você é um gerador de código HTML e CSS. Responda SOMENTE com código puro. NUNCA use crases, markdown ou explicações. Formato: primeiro <style> com o CSS, depois o HTML. Siga EXATAMENTE o que o usuário pedir. Se pedir algo quicando, use translateY no @keyframes. Se pedir algo girando, use rotate."
                    },
                    {
                        role: "user",
                        content: textUser
                    }
                ]
            })
        });

        if (!resAPI.ok) {
            throw new Error('Erro na API');
        }

        const data = await resAPI.json();
        const result = data.choices?.[0]?.message?.content || "";

        codeBox.textContent = result;
        codeResult.srcdoc = result;

    } catch (erro) {
        codeBox.textContent = 'Erro ao gerar código. Tente novamente.';
        console.error(erro);
    }
};