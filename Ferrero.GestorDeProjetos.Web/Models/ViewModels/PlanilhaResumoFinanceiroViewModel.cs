using System.ComponentModel.DataAnnotations;

namespace Ferrero.GestorDeProjetos.Web.Models.ViewModels
{
    /// <summary>
    /// Esta classe contém os atributos e métodos de lançamento financeiro.
    /// </summary>
    public class PlanilhaResumoFinanceiroViewModel
    {
        [Display(Name = "Data do Resumo")]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:dd/MM/yyyy}")]
        [Required(ErrorMessage = "Por favor, informe a data do resumo.")]
        public string Data { get; set; }

        [Display(Name = "Arquivo")]
        public string Arquivo { get; set; } = string.Empty;
    }
}