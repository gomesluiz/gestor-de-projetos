using System.ComponentModel.DataAnnotations;

namespace Ferrero.GestorDeProjetos.Web.Models
{
    /// <summary>
    /// Esta classe contém os atributos e métodos de uma requisicao de compra
    /// view model.
    /// </summary>
    public class RequisicaoDeCompraViewModel {
        public int Id { get; set; }

        [Required(ErrorMessage = "Por favor, digite o número da requisição de compra.")]
        [Display(Name = "Número")]
        public long Numero { get; set; }

        [Required(ErrorMessage = "Por favor, digite a data da requisição de compra.")]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:dd/MM/yyyy}")]
        [Display(Name = "Data")]
        public string Data { get; set; }

        [Display(Name = "Ordem de Compra")]
        public long? NumeroDaOrdemDeCompra { get; set; }

        [Required(ErrorMessage = "Por favor, digite a descrição da requisição de compra.")]
        [StringLength(250, ErrorMessage = "A descrição da requisição de compra deve possuir no máximo 250 caracteres.")]
        public string Descricao { get; set; }
        
        [Required(ErrorMessage = "Por favor, digite o ativo imobilizado associado a requisição de compra.")]
        [Display(Name = "Ativo")]
        public int AtivoId { get; set; } 

        [Display(Name = "Proposta")]
        public string Proposta { get; set; } = string.Empty;
    }
}