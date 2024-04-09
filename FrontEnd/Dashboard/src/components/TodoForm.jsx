import { useState } from 'react'
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000'
})

const TodoForm = ({ treatTodo, categories }) => {
    const [value, setValue] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!value || !category || !description) return;

        treatTodo(value, category, description);

        setValue("");
        setCategory("");
        setDescription("");

        // Enviar os dados para o servidor
        api.post('/create', {
            value,
            description,
            category,
        })
        .then((response) => {
            console.log(response);
            // Limpar os campos após o envio bem-sucedido
            setValue('');
            setCategory('');
            setDescription('');
        })
        .catch((error) => {
            console.error('Erro ao enviar os dados:', error);
        });

    }

    return <div className="todo-form expandable">
        <input type="checkbox" id="task-form-trigger" className='trigger' />
        <label htmlFor="task-form-trigger">
            <div className="title-bar">
                <h2 className="title">Gerenciar tarefas:</h2>
                <ion-icon class="icon" name="chevron-back"></ion-icon>
            </div>
        </label>
        <div className="content-wrapper">
            <div className='content'>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Digite o título"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder='Digite a descrição'
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">Selecione uma categoria</option>
                        {categories.map(c =>
                            <option key={c} value={c} >{c}</option>
                        )}
                    </select>
                    <button type="submit" >Criar/editar tarefa</button>
                </form>
            </div>
        </div>
    </div>
}

export default TodoForm
