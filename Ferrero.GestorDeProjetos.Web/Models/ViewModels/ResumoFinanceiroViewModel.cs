using System.ComponentModel.DataAnnotations;

namespace Ferrero.GestorDeProjetos.Web.Models.ViewModels
{
    /// <summary>
    /// Esta classe contém os atributos e métodos de lançamento financeiro.
    /// </summary>
    public class ResumoFinanceiroViewModel
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Por favor, digite o número da ordem de investimento")]
        [Display(Name = "Ordem de Investimento")]
        public int OrdemDeInvestimentoId { get; set; }

        [Display(Name = "Ordem de Investimento")]
        public string OrdemDeInvestimentoNumero { get; set; }
        
        [Display(Name = "Budget")]
        public decimal OrdemDeInvestimentoBudget { get; set; }

        [Display(Name = "Data do Resumo")]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:dd/MM/yyyy}")]
        [Required(ErrorMessage = "Por favor, informe a data do resumo.")]
        public string Data { get; set; }

        [Required(ErrorMessage = "Por favor, digite o valor do commitment.")]
        public decimal Commitment { get; set; }

        [Required(ErrorMessage = "Por favor, digite o valor do assigned.")]
        public decimal Assigned { get; set; }

        [Required(ErrorMessage = "Por favor, digite o valor do actual")]
        public decimal Actual { get; set; }
        
        [Required(ErrorMessage = "Por favor, digite o valor do available")]
        public decimal Available { get; set; }       
    }
}