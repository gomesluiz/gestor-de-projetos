using Microsoft.EntityFrameworkCore;

using Ferrero.GestorDeProjetos.Web.Models;

namespace Ferrero.GestorDeProjetos.Web.Persistence.Context
{
    public class ApplicationDbContext : DbContext
  {
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : base(options) { }

    public DbSet<Ativo> Ativos { get; set; }
    public DbSet<CentroDeCusto> CentrosDeCusto { get; set; }
    public DbSet<Fornecedor> Fornecedores { get; set; }
    public DbSet<Projeto> Projetos { get; set; }
    public DbSet<OrdemDeInvestimento> OrdensDeInvestimento { get; set; }
    public DbSet<ResumoFinanceiro> ResumosFinanceiros { get; set; }
    public DbSet<RequisicaoDeCompra> RequisicoesDeCompra { get; set; }
    public DbSet<NotaFiscal> NotasFiscais { get; set; }

    // Queries ad-hocs.
    //public DbQuery<LancamentoFinanceiro> ResumosFinanceiros {get; set;}
    //public DbQuery<Intervalo> IntervaloDeData {get; set;}

    protected override void OnModelCreating(ModelBuilder builder)
    {
       
      // Model Ativo
      builder.Entity<Ativo>(entity =>
      {
        entity.HasKey(e => e.Id);
        entity.Property(e => e.Id)
          .ValueGeneratedNever()
          .IsRequired();
        entity.Property(e => e.Descricao)
          .HasMaxLength(50)
          .IsRequired();  
        entity.Property(e => e.Planta)
          .HasMaxLength(50)
          .IsRequired();
        entity.Property(e => e.Quantidade)
          .IsRequired();
        entity.Property(e => e.Divisao)
          .IsRequired();  
        entity.Property(e => e.Natureza)
          .IsRequired();
        entity.Property(e => e.Propriedade)
          .IsRequired();
        entity.Property(e => e.DestinoDeUso)
          .IsRequired();
        entity.Property(e => e.SituacaoParaUso)
          .IsRequired();
        entity.Property(e => e.Observacoes)
          .HasMaxLength(250);
        entity.Property(e => e.Requisitante)
          .HasMaxLength(50);
        entity.Property(e => e.SituacaoDoAtivo)
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

      // Model OrdemDeInvestimento
      builder.Entity<OrdemDeInvestimento>(entity =>
      {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Numero)
                .HasMaxLength(7)
                .IsRequired();
            entity.Property(e => e.Budget)
                .HasColumnType("DECIMAL(10,2)")
                .IsRequired();
      });


      // Model LancamentoFinanceiro
      builder.Entity<ResumoFinanceiro>(entity =>
      {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Data)
                .HasColumnType("DATETIME")
                .IsRequired();
            entity.Property(e => e.Commitment)
                .HasColumnType("DECIMAL(10,2)")
                .IsRequired();
            entity.Property(e => e.Assigned)
                .HasColumnType("DECIMAL(10,2)")
                .IsRequired();
             entity.Property(e => e.Actual)
                .HasColumnType("DECIMAL(10,2)")
                .IsRequired();
             entity.Property(e => e.Available)
                .HasColumnType("DECIMAL(10,2)")
                .IsRequired();
      });

      // Model RequisicaoDeCompra
      builder.Entity<RequisicaoDeCompra>(entity =>
      {
        entity.HasKey(e => e.Id);
        entity.Property(e => e.Id)
          .IsRequired();
        entity.Property(e => e.Numero)
          .IsRequired();
        entity.Property(e => e.Data)
          .HasColumnType("DATETIME");
        entity.Property(e => e.Descricao)
          .HasMaxLength(250);
        entity.Property(e => e.Proposta)
          .IsRequired()
          .HasMaxLength(250);
      });

      // Model NotaFiscal
      builder.Entity<NotaFiscal>(entity =>
      {
        entity.HasKey(e => e.Id);
        entity.Property(e => e.Id)
          .IsRequired();
        entity.Property(e => e.Numero)
          .IsRequired();
        entity.Property(e => e.DataDeLancamento)
          .HasColumnType("DATETIME");
        entity.Property(e => e.Migo)
          .IsRequired();
        entity.Property(e => e.Valor)
          .IsRequired();
      });
    }  
  }
}