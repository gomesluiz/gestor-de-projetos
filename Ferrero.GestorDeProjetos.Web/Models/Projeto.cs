using System;
using System.ComponentModel.DataAnnotations;

namespace Ferrero.GestorDeProjetos.Web.Models {
  /// <summary>
  /// Projetos 
  /// </summary>
  public class Projeto {
    public int ID { get; set; }
    public string Nome { get; set; }
    public string Descricao { get; set; }
    
    [DataType(DataType.Date)]
    [Display(Name = "Data de Início")]
    public DateTime DataDeInicio { get; set; }
    
    [DataType(DataType.Date)]
    [Display(Name = "Data de Término")]
    public DateTime DataDeTermino { get; set; }
    
    [Display(Name = "Concluído?")]
    public bool Concluido { get; set; }
  }
}