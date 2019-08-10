using System.Collections.Generic;

namespace Ferrero.GestorDeProjetos.Web.Models.Kanban
{
    public class ListaViewModel
    {
        public string Nome { get; set; }

        public string Estilo { get; set; }
        public IList<TarefaViewModel> Tarefas { get; set; }

        public bool PodeAdicionar { get; set; }

        public bool PodeRemoverTodasTarefas { get; set; }

        public ListaViewModel(string nome, IList<TarefaViewModel> tarefas, string estilo
            , bool adiciona, bool removeTodasTarefas)
        {
            Nome    = nome;
            Tarefas = tarefas;    
            Estilo  = estilo;
            PodeAdicionar = adiciona;
            PodeRemoverTodasTarefas = removeTodasTarefas;
        }
    }
}