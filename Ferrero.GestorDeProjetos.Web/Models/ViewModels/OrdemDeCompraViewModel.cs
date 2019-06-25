using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Ferrero.GestorDeProjetos.Web.Models
{
    /// <summary>
    /// Esta classe contém os atributos e métodos de uma ordem de compra.
    /// </summary>
    public class OrdemDeCompraViewModel {
    public int Id { get; set; }

    [Required(ErrorMessage = "Por favor, digite o número da ordem de compra.")]
    [Display(Name = "Número")]
    public long Numero { get; set; }

    [Required(ErrorMessage = "Por favor, digite a data da ordem de compra.")]
    [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:dd/MM/yyyy}")]
    [Display(Name = "Data")]
    public string Data { get; set; }

    [Required(ErrorMessage = "Por favor, digite o número da requisicao.")]
    [Display(Name = "Número da Requisição")]
    public long NumeroDaRequisicao { get; set; }

    [Required(ErrorMessage = "Por favor, digite o valor da ordem de compra.")]
    [Display(Name = "Valor")]
    public double Valor { get; set; }

    [Required(ErrorMessage = "Por favor, digite a descrição da ordem de compra.")]
    [StringLength(250, ErrorMessage = "A descrição da ordem de compra deve possuir no máximo 250 caracteres.")]
    public string Descricao { get; set; }
    
    [Required(ErrorMessage = "Por favor, digite o ativo imobilizado.")]
    [Display(Name = "Ativo")]
    public int AtivoId { get; set; } 

   // [Required(ErrorMessage = "Por favor, selecione o nome do documento da ordem de compra.")]
    [Display(Name = "Documento")]
    public string Documento { get; set; } = string.Empty;
  }
}