using Ferrero.GestorDeProjetos.Web.Models.Domain;

namespace Ferrero.GestorDeProjetos.Web.Models.Kanban
{
    public class Tarefa
    {
        public int Id { get; set; }
        public string Titulo { get; set; }

        public string Descricao { get; set; }
        
        // 1 - A Fazer; 2 - Fazendo; 3 - Feito
        public int ListaId { get; set; } 

        public int ProjetoId   { get; set;}
        public Projeto Projeto { get; set; }
    }
}