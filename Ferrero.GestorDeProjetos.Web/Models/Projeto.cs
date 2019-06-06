using System;
using System.ComponentModel.DataAnnotations;

namespace Ferrero.GestorDeProjetos.Web.Models {
  /// <summary>
  /// Esta classe contém os atributos e métodos de um projeto.
  /// </summary>
  public class Projeto {
    public int Id { get; set; }
    public string Nome { get; set; }
    public string Descricao { get; set; }
    
    [DataType(DataType.Date)]
    [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:dd/MM/yyyy}")]
    [Display(Name = "Data de Início")]
    public DateTime DataDeInicio { get; set; }    
    
    [DataType(DataType.Date)]
    [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:dd/MM/yyyy}")]
    [Display(Name = "Data de Término")]
    public DateTime DataDeTermino { get; set; }
    public bool Concluido { get; set; }
  }
}