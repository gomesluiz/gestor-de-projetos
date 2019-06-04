IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;

GO

CREATE TABLE [CentrosDeCusto] (
    [Id] int NOT NULL,
    [Nome] nvarchar(50) NOT NULL,
    CONSTRAINT [PK_CentrosDeCusto] PRIMARY KEY ([Id])
);

GO

CREATE TABLE [Fornecedores] (
    [Id] int NOT NULL IDENTITY,
    [Nome] nvarchar(50) NOT NULL,
    CONSTRAINT [PK_Fornecedores] PRIMARY KEY ([Id])
);

GO

CREATE TABLE [Projetos] (
    [Id] int NOT NULL IDENTITY,
    [Nome] nvarchar(50) NOT NULL,
    [Descricao] nvarchar(250) NULL,
    [DataDeInicio] DATETIME NOT NULL,
    [DataDeTermino] DATETIME NOT NULL,
    [Concluido] bit NOT NULL,
    CONSTRAINT [PK_Projetos] PRIMARY KEY ([Id])
);

GO

CREATE TABLE [OrdensDeInvestimento] (
    [Id] int NOT NULL IDENTITY,
    [Numero] nvarchar(7) NOT NULL,
    [ProjetoId] int NULL,
    [Valor] float NOT NULL,
    CONSTRAINT [PK_OrdensDeInvestimento] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_OrdensDeInvestimento_Projetos_ProjetoId] FOREIGN KEY ([ProjetoId]) REFERENCES [Projetos] ([Id]) ON DELETE NO ACTION
);

GO

CREATE TABLE [Ativos] (
    [Id] int NOT NULL,
    [Descricao] nvarchar(max) NULL,
    [Localizacao] nvarchar(50) NOT NULL,
    [OrdemDeInvestimentoId] int NULL,
    [Situacao] int NOT NULL,
    [CentroDeCustoId] int NULL,
    CONSTRAINT [PK_Ativos] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Ativos_CentrosDeCusto_CentroDeCustoId] FOREIGN KEY ([CentroDeCustoId]) REFERENCES [CentrosDeCusto] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Ativos_OrdensDeInvestimento_OrdemDeInvestimentoId] FOREIGN KEY ([OrdemDeInvestimentoId]) REFERENCES [OrdensDeInvestimento] ([Id]) ON DELETE NO ACTION
);

GO

CREATE TABLE [OrdensDeCompra] (
    [Id] int NOT NULL IDENTITY,
    [Numero] bigint NOT NULL,
    [Data] DATETIME NOT NULL,
    [NumeroDaRequisicao] bigint NOT NULL,
    [Valor] float NOT NULL,
    [Descricao] nvarchar(250) NULL,
    [AtivoId] int NULL,
    CONSTRAINT [PK_OrdensDeCompra] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_OrdensDeCompra_Ativos_AtivoId] FOREIGN KEY ([AtivoId]) REFERENCES [Ativos] ([Id]) ON DELETE NO ACTION
);

GO

CREATE TABLE [NotasFiscais] (
    [Id] int NOT NULL IDENTITY,
    [Numero] int NOT NULL,
    [DataDeLancamento] DATETIME NOT NULL,
    [FornecedorId] int NULL,
    [OrdemDeCompraId] int NULL,
    [Migo] bigint NOT NULL,
    [Valor] float NOT NULL,
    CONSTRAINT [PK_NotasFiscais] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_NotasFiscais_Fornecedores_FornecedorId] FOREIGN KEY ([FornecedorId]) REFERENCES [Fornecedores] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_NotasFiscais_OrdensDeCompra_OrdemDeCompraId] FOREIGN KEY ([OrdemDeCompraId]) REFERENCES [OrdensDeCompra] ([Id]) ON DELETE NO ACTION
);

GO

CREATE INDEX [IX_Ativos_CentroDeCustoId] ON [Ativos] ([CentroDeCustoId]);

GO

CREATE INDEX [IX_Ativos_OrdemDeInvestimentoId] ON [Ativos] ([OrdemDeInvestimentoId]);

GO

CREATE INDEX [IX_NotasFiscais_FornecedorId] ON [NotasFiscais] ([FornecedorId]);

GO

CREATE INDEX [IX_NotasFiscais_OrdemDeCompraId] ON [NotasFiscais] ([OrdemDeCompraId]);

GO

CREATE INDEX [IX_OrdensDeCompra_AtivoId] ON [OrdensDeCompra] ([AtivoId]);

GO

CREATE INDEX [IX_OrdensDeInvestimento_ProjetoId] ON [OrdensDeInvestimento] ([ProjetoId]);

GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20190604195756_InitialSchemaCreation', N'2.2.4-servicing-10062');

GO

