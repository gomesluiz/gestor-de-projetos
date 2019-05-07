using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

using Ferrero.GestorDeProjetos.Web.Models;

namespace Ferrero.GestorDeProjetos.Web.Data
{
  public class ProjetosDBContext : DbContext
  {
    public ProjetosDBContext(DbContextOptions<ProjetosDBContext> options)
    : base(options) { }

    public DbSet<Ativo> Ativos { get; set; }
    public DbSet<CentroDeCusto> CentrosDeCusto { get; set; }
    public DbSet<Projeto> Projetos { get; set; }
    public DbSet<Fornecedor> Fornecedores { get; set; }
    
    protected override void OnModelCreating(ModelBuilder builder)
    {
      // Model Projeto
      builder.Entity<Projeto>(entity =>
      {
        entity.HasKey(e => e.Id);
        entity.Property(e => e.Id)
          .IsRequired();
        entity.Property(e => e.Nome)
          .HasMaxLength(50)
          .IsRequired();
        entity.Property(e => e.Descricao)
          .HasMaxLength(250);
        entity.Property(e => e.DataDeInicio)
          .HasColumnType("DATETIME");
        entity.Property(e => e.DataDeTermino)
          .HasColumnType("DATETIME");
        entity.Property(e => e.Concluido)
          .IsRequired();
      });

      // Model CentroDeCusto
      builder.Entity<CentroDeCusto>(entity =>
      {
        entity.HasKey(e => e.Id);
        entity.Property(e => e.Id)
          .ValueGeneratedNever()
          .IsRequired();
        entity.Property(e => e.Nome)
          .HasMaxLength(50)
          .IsRequired();
      });

      // Model Ativo
      builder.Entity<Ativo>(entity =>
      {
        entity.HasKey(e => e.Id);
        entity.Property(e => e.Id)
          .ValueGeneratedNever()
          .IsRequired();
        entity.Property(e => e.Localizacao)
          .HasMaxLength(50)
          .IsRequired();
        entity.Property(e => e.OrdemDeInvestimento)
          .HasMaxLength(7)
          .IsRequired();
        entity.Property(e => e.Situacao)
          .IsRequired();
      });

      // Model Fornecedor
      builder.Entity<Fornecedor>(entity =>
      {
        entity.HasKey(e => e.Id);
        entity.Property(e => e.Id)
          .IsRequired();
        entity.Property(e => e.Nome)
          .HasMaxLength(50)
          .IsRequired();
      });
    }
  }
}