using System;
using System.ComponentModel.DataAnnotations;

namespace Ferrero.GestorDeProjetos.Web.Models
{
    /// <summary>
    /// Esta classe contém os atributos e métodos de um resumo finaceiro.
    /// </summary>
    public class ResumoFinanceiro {
        public int Id { get; set; }

        [Display(Name = "Número")]
        public string Numero { get; set; }

        [Display(Name = "Projeto")]
        public int ProjetoId { get; set; }
        
        [Display(Name = "Nome Projeto")]
        public string NomeDoProjeto { get; set; }

        [Display(Name = "Bugdget")]
        public double? Bugdget { get; set; }

        [Display(Name = "Actual")]
        public double Actual { get; set; }

        [Display(Name = "Commitment")]
        public double Commitment { get; set; }

        [Display(Name = "Assigned")]
        public double Assigned { get; set; }

        [Display(Name = "Available")]
        public double Available { get; set; }
        public DateTime DateOfWeek { get; set; }
  }
}