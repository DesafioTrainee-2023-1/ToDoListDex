import { useState } from 'react'

const CategoryForm = ({ treatCategory }) => {
    const [category, setCategory] = useState("");

    const handleSubmit = e => {
        e.preventDefault();
        if (!category) return;

        treatCategory(category);

        setCategory("");
    }

    return <div className='category-form expandable'>
    <input type="checkbox" id="category-form-trigger" className='trigger' />
    <label htmlFor="category-form-trigger">
        <div className="title-bar">
            <h2 className="title">Gerenciar categorias:</h2>
            <ion-icon class="icon" name="chevron-back"></ion-icon>
        </div>
    </label>
    <div className="content-wrapper">
        <div className='content'>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Digite o título" 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)} 
                />
                <button type="submit">Criar/remover categoria</button>
            </form>
        </div>
    </div>
    </div>
}

export default CategoryForm 
