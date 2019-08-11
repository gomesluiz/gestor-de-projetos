using System.ComponentModel.DataAnnotations;

namespace Ferrero.GestorDeProjetos.Web.Models.Kanban
{
    public class TarefaViewModel
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "Por favor, digite o título da tarefa.")]
        [StringLength(50
            , MinimumLength = 1
            , ErrorMessage  = "A {0} deve possuir no máximo {1} e no mínimo {2} caracteres.")]
        [Display(Name = "Titulo")]
        public string Titulo { get; set; }

        [StringLength(250
            , ErrorMessage  = "A {0} deve possuir no máximo {1} caracteres.")]
        [Display(Name = "Descrição")]
        public string Descricao { get; set; }
        
        // 1 - A Fazer; 2 - Fazendo; 3 - Feito
        [Range (1, 3
            , ErrorMessage = "O Lista deve ser escolhida entre 1 e 3 ")]
        [Display(Name = "Lista")]
        public int ListaId { get; set; } 

        [Required(ErrorMessage = "Por favor, selecione identificador do projeto.")]
        [Display(Name = "Projeto")]
        public int ProjetoId { get; set; }

        public static explicit operator TarefaViewModel(Tarefa tarefa)
        {
            return new TarefaViewModel
            {
                Id = tarefa.Id,
                Titulo = tarefa.Titulo,
                Descricao = tarefa.Descricao,
                ListaId = tarefa.ListaId,
                ProjetoId = tarefa.Projeto.Id,
            };
        }
 
        public static explicit operator Tarefa(TarefaViewModel tarefa)
        {
            return new Tarefa
            {
                Id = tarefa.Id,
                Titulo = tarefa.Titulo,
                Descricao = tarefa.Descricao,
                ListaId = tarefa.ListaId,
                ProjetoId = tarefa.ProjetoId
            };
        }
    }
}