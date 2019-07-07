using System.ComponentModel.DataAnnotations;

namespace Ferrero.GestorDeProjetos.Web.Models
{
    /// <summary>
    /// Esta classe contém os atributos e métodos de um lançamento finaceiro.
    /// </summary>
    public class LancamentoFinanceiroViweModel
    {
        public int Id { get; set; }

        [Display(Name = "Data")]
        public string Data { get; set; }

        [Display(Name = "Budget")]
        public decimal Budget { get; set; }

        [Display(Name = "Commitment")]
        public decimal Commitment { get; set; }

        [Display(Name = "Assigned")]
        public decimal Assigned { get; set; }

        [Display(Name = "Actual")]
        public decimal Actual
        {
            get
            {
                return Commitment + Assigned;
            }
        }

        [Display(Name = "Available")]
        public decimal Available
        {
            get
            {
                return Budget - Actual;
            }
        }
    }
}