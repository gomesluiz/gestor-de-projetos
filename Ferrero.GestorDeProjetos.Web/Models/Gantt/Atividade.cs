using System;

namespace Ferrero.GestorDeProjetos.Web.Models.Gantt
{
    public class Atividade
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public DateTime StartDate { get; set; }
        public int Duration { get; set; }
        public decimal Progress { get; set; }
        public int? ParentId { get; set; }
        public string Type { get; set; }
        public int ProjetoId { get; set; }
        public Projeto Projeto { get; set; }
    }
}