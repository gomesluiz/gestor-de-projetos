using System;
using System.ComponentModel.DataAnnotations;

namespace Ferrero.GestorDeProjetos.Web.Models {
  /// <summary>
  /// Esta classe contém os atributos e métodos de uma ordem de investimento.
  /// </summary>
  public class OrdemDeInvestimentoViewModel {
    public int Id { get; set; }

    [Display(Name = "Número")]
    [Required(ErrorMessage = "Por favor, digite o número da ordem de investimento.")]
    [StringLength(7, ErrorMessage = "O número da ordem de investimento deve possuir no máximo 7 caracteres.")]
    public string Numero { get; set; }

    [Display(Name = "Projeto")]
    [Required(ErrorMessage = "Por favor, informe o número do projeto da ordem de investimento.")]
    public int ProjetoId { get; set; }
    
    [Display(Name = "Bugdget")]
    [Required(ErrorMessage = "Por favor, informe o valor da ordem de investimento.")]
    public double Valor { get; set; }
  }
}