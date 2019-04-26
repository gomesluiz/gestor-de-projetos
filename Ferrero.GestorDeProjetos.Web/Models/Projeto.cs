using System;
using System.ComponentModel.DataAnnotations;

namespace Ferrero.GestorDeProjetos.Web.Models {
  /// <summary>
  /// Esta classe contém os atributos e métodos de um projeto.
  /// </summary>
  public class Projeto {
    public int ID { get; set; }

    [Required(ErrorMessage = "Por favor, digite o nome do projeto.")]
    public string Nome { get; set; }
    

    public string Descricao { get; set; }
    
    [DataType(DataType.Date)]
    [Display(Name = "Data de Início")]
    [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:yyyy-MM-dd}")]
    [Required(ErrorMessage = "Por favor, entre com a data de início do projeto.")]
    public DateTime DataDeInicio { get; set; }
    
    [DataType(DataType.Date)]
    [Display(Name = "Data de Término")]
    [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:yyyy-MM-dd}")]
    [Required(ErrorMessage = "Por favor, entre com a data estimada de término do projeto.")]
    public DateTime DataDeTermino { get; set; }
    
    [Display(Name = "Concluído?")]
    public bool Concluido { get; set; }
  }
}