/* eslint-env node */

import { fakerEN_US as faker } from '@faker-js/faker'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.VITE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

const testingUserEmail = process.env.TESTING_USER_EMAIL
const testingUserPassword = process.env.TESTING_USER_PASSWORD
if (!testingUserEmail) {
  console.error('Have you forgot to add TESTING_USER_EMAIL to your .env file?')
  process.exit()
}

const logErrorAndExit = (tableName, error) => {
  console.error(
    `An error occurred in table '${tableName}' with code ${error.code}: ${error.message}`,
  )
  process.exit(1)
}

const logStep = (stepMessage) => {
  console.info(stepMessage)
}

/**
 * @returns {Promise<string | null>}
 */
const primaryTestUserExists = async () => {
  logStep('Checking if primary test user exists...')

  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, role, organization_id')
    .eq('username', 'testaccount1')
    .single()

  if (error) {
    if (error.code !== 'PGRST116') {
      logErrorAndExit('Profiles', error)
    }
    console.info('Primary test user not found. Will create one.')
    return null
  }

  if (!data) {
    console.info('Primary test user not found. Will create one.')
    return null
  }

  if (data.role !== 'super_admin' || data.organization_id !== null) {
    logStep('Ensuring primary test user has super_admin privileges...')
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'super_admin', organization_id: null })
      .eq('id', data.id)

    if (updateError) {
      logErrorAndExit('Profiles', updateError)
    }
  }

  logStep('Primary test user is found.')
  return data.id
}

const createPrimaryTestUser = async () => {
  logStep('Creating primary test user...')
  const firstName = 'Test'
  const lastName = 'Account'
  const userName = 'testaccount1'

  const { data, error } = await supabase.auth.signUp({
    email: testingUserEmail,
    password: testingUserPassword,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        full_name: firstName + ' ' + lastName,
        username: userName,
      },
    },
  })

  if (error) {
    logErrorAndExit('Users', error)
  }

  if (data) {
    const userId = data.user.id
    await supabase.from('profiles').insert({
      id: userId,
      full_name: firstName + ' ' + lastName,
      username: userName,
      bio: 'The main testing account',
      avatar_url: `https://i.pravatar.cc/150?u=${data.user.id}`,
      organization_id: null,
      role: 'super_admin',
    })

    logStep('Primary test user created successfully.')
    return userId
  }
}

const seedProjects = async (numEntries, userId, organizationsMeta) => {
  logStep('Seeding projects...')
  const projects = []

  if (!organizationsMeta?.length) {
    console.warn('Nenhuma organização disponível para vincular projetos durante o seed.')
    return []
  }

  const pickOrganization = () => faker.helpers.arrayElement(organizationsMeta)
  const makeSlug = (value) =>
    value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[^a-z0-9 ]/g, '')
      .trim()
      .replace(/\s+/g, '-')

  const addProject = ({
    name,
    description,
    cover_image_url = null,
    cover_image_path = null,
    slug,
  }) => {
    const organization = pickOrganization()

    projects.push({
      name,
      slug: slug ?? makeSlug(name),
      description,
      status: faker.helpers.arrayElement(['in-progress', 'completed']),
      collaborators: faker.helpers.arrayElements([userId]),
      cover_image_url,
      cover_image_path: cover_image_path ?? cover_image_url,
      organization_id: organization.id,
      city: organization.address_city,
      state: organization.address_state,
    })
  }

  const projectTemplates = [
    {
      name: 'Biblioteca Comunitária Digital',
      description:
        'Uma plataforma de acesso livre que reúne livros digitais, audiobooks e cursos interativos, com o objetivo de combater a exclusão educacional em áreas de baixa renda. Além do acervo, voluntários oferecem oficinas práticas de leitura e rodas de conversa online, estimulando o hábito da leitura e a troca de conhecimentos entre diferentes gerações.',
      cover_image_url:
        'https://educationsnapshots.com/wp-content/uploads/sites/4/2023/05/lakeside-community-library-8-1200x800-compact.jpg',
    },
    {
      name: 'Reciclar é Viver',
      description:
        'Iniciativa voltada para escolas públicas e associações de bairro, onde estudantes e moradores aprendem sobre coleta seletiva, compostagem e reaproveitamento de resíduos. O projeto promove oficinas práticas de artesanato com materiais recicláveis, gerando renda alternativa, e cria ecopontos comunitários para incentivar o descarte consciente.',
      cover_image_url:
        'https://static.wixstatic.com/media/361ccc_4d73c18b7f234bc584beddcf655ada4c~mv2.png/v1/fill/w_329,h_460,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/361ccc_4d73c18b7f234bc584beddcf655ada4c~mv2.png',
    },
    {
      name: 'Verde no Bairro',
      description:
        'Programa de revitalização ambiental que mobiliza moradores para plantar árvores, criar hortas comunitárias e revitalizar praças abandonadas. Além de melhorar a qualidade do ar e reduzir as ilhas de calor, promove a educação ambiental, transformando espaços urbanos em ambientes de convivência e lazer para a comunidade.',
      cover_image_url:
        'https://media.gazetadopovo.com.br/2024/01/24104007/Shutterstock_1127123753-960x540.jpg',
    },
    {
      name: 'Saúde em Movimento',
      description:
        'Unidades móveis equipadas com consultórios percorrem comunidades afastadas oferecendo consultas médicas, exames preventivos e campanhas de vacinação. O projeto também realiza palestras educativas sobre nutrição, prevenção de doenças crônicas e cuidados básicos de higiene, diminuindo os índices de internações por falta de atendimento primário.',
      cover_image_url:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvUL4ns_7z6aqnDRZWYqkJGp8UnE6laIl1qw&s',
    },
    {
      name: 'Capacita Jovem',
      description:
        'Programa de formação profissional gratuito que prepara jovens em situação de vulnerabilidade para o mercado de trabalho. Os cursos abrangem desde tecnologia da informação e design até atendimento ao cliente e logística. Além do aprendizado, os participantes recebem orientação vocacional, acompanhamento psicológico e conexão com empresas parceiras para estágio e emprego.',
      cover_image_url:
        'https://orgacis.com.br/uploads/projetos/tons-pastel-beneficios-da-massoterapia-fisioterapia-e-massagem-delicado-post-instagram%7C1708965108.png',
    },
    {
      name: 'Mãos que Acolhem',
      description:
        'Rede de solidariedade voltada para pessoas em situação de rua, oferecendo diariamente refeições nutritivas, roupas limpas e kits de higiene. Além da ajuda emergencial, o projeto disponibiliza atendimento jurídico e psicológico, orientando sobre programas de reinserção social, oportunidades de capacitação e encaminhamento ao mercado de trabalho.',
      cover_image_url:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTUrHJBY9tD7qqSYHefarRQLWXwGvUdc07xledRIyj-8TVLGPx0OBrAoTiRmp7F7YpslM&usqp=CAU',
    },
    {
      name: 'Energia Sustentável nas Escolas',
      description:
        'Projeto de eficiência energética que instala painéis solares em escolas públicas, reduzindo custos com eletricidade e reinvestindo a economia em melhorias pedagógicas. Além da infraestrutura, os alunos participam de oficinas práticas sobre sustentabilidade, aprendendo a construir pequenos protótipos de energia limpa e desenvolvendo consciência ecológica desde cedo.',
      cover_image_url:
        'https://solarking.com.br/wp-content/uploads/2025/04/Energia-Solar-na-Educacao-Transformando-Escolas-em-Ambientes-Sustentaveis-e-Inovadores.webp',
    },
    {
      name: 'Esporte para Todos',
      description:
        'Criação de polos esportivos em regiões periféricas que oferecem aulas de futebol, vôlei, natação, artes marciais e dança. O projeto promove inclusão social, disciplina e espírito de equipe, afastando crianças e adolescentes de situações de risco. Competições locais são organizadas para estimular o protagonismo juvenil e a integração comunitária.',
      cover_image_url:
        'https://fundosocial.sesisc.org.br/storage/images/projetos/pav4Qhy5uJ82xJ82dFtylu2wcOZgJMhTgyrpBsKv.jpg',
    },
    {
      name: 'Mulheres Empreendedoras',
      description:
        'Iniciativa de capacitação que oferece oficinas de gestão financeira, marketing digital e desenvolvimento de produtos artesanais. O projeto dá suporte a mulheres em situação de vulnerabilidade, proporcionando acesso a microcréditos e mentorias individuais para fortalecer negócios próprios, estimulando autonomia financeira e igualdade de oportunidades.',
      cover_image_url: 'https://acif.org.br/wp-content/uploads/2023/10/mulher-empreendedora.jpg',
    },
    {
      name: 'Cultura na Praça',
      description:
        'Projeto que transforma espaços públicos em palcos culturais, promovendo apresentações de música, teatro e dança, além de exposições de artistas locais. Oficinas de escrita criativa, pintura e fotografia incentivam o talento da comunidade, valorizando a diversidade cultural e reforçando os laços sociais através da arte.',
      cover_image_url:
        'https://muralzinhodeideias.com.br/wp-content/uploads/2023/08/20-8_cultura_na_praca.jpeg-1024x10241-1.jpg',
    },
    {
      name: 'Tecnologia Solidária',
      description:
        'Iniciativa que coleta equipamentos eletrônicos usados, realiza manutenção e doa para escolas e ONGs. Paralelamente, jovens aprendizes são capacitados em manutenção de computadores e redes, adquirindo experiência prática para ingressar no mercado de tecnologia. Assim, o projeto une sustentabilidade, inclusão digital e geração de oportunidades.',
      cover_image_url:
        'https://i0.wp.com/ts.museu-goeldi.br/wp-content/uploads/2025/08/Tecnologia_Social-1.jpg?fit=768%2C614&ssl=1',
    },
    {
      name: 'Alimentar com Amor',
      description:
        'Campanha permanente de arrecadação de alimentos que envolve supermercados, empresas e voluntários na formação de cestas básicas. As famílias beneficiadas também participam de oficinas de nutrição, onde aprendem a preparar refeições equilibradas com aproveitamento integral dos alimentos, combatendo tanto a fome quanto o desperdício.',
      cover_image_url:
        'https://materiaincognita.com.br/wp-content/uploads/2014/03/Coracao-Comida.jpg',
    },
    {
      name: 'Transporte Solidário',
      description:
        'Rede de motoristas voluntários que oferecem transporte gratuito para pacientes de comunidades afastadas que precisam acessar hospitais e centros de referência. O projeto conta com um sistema de agendamento simples e garante que o tratamento médico não seja interrompido por falta de locomoção, salvando vidas e reduzindo desigualdades no acesso à saúde.',
      cover_image_url:
        'https://www.cm-castelo-paiva.pt/media/paginas/cat_media/online/403.original.jpg',
    },
    {
      name: 'Educação Inclusiva',
      description:
        'Programa de formação para professores e gestores escolares voltado ao atendimento de alunos com deficiência ou dificuldades de aprendizagem. Inclui treinamentos em metodologias pedagógicas adaptativas, uso de tecnologias assistivas e produção de materiais didáticos acessíveis, garantindo que a escola seja um espaço verdadeiramente inclusivo.',
      cover_image_url:
        'https://www.bobzoom.com.br/wp-content/uploads/2021/06/educacao-inclusiva-01.jpeg',
    },
    {
      name: 'Cidadania Digital',
      description:
        'Projeto educativo que oferece oficinas sobre segurança online, proteção de dados pessoais, combate a fake news e comportamento ético nas redes sociais. O objetivo é preparar adolescentes e jovens para serem cidadãos digitais responsáveis, críticos e conscientes, fortalecendo a democracia e o uso saudável da tecnologia.',
      cover_image_url:
        'https://d23vy2bv3rsfba.cloudfront.net/listas/1_0faf6ccfd609aed0c56c5ad0d83c6921_5323.png',
    },
  ]

  projectTemplates.forEach(addProject)

  for (let i = 0; i < numEntries; i++) {
    const name = faker.company.catchPhrase()
    addProject({
      name,
      description: faker.lorem.paragraphs(2),
      slug: makeSlug(`${name}-${i}`),
    })
  }

  const { data, error } = await supabase.from('projects').insert(projects).select('id')

  if (error) return logErrorAndExit('Projects', error)

  logStep('Projects seeded successfully.')

  return data
}

const seedOrganizations = async () => {
  logStep('Seeding organizations...')
  const organizations = [
    {
      name: 'Uninorte',
      bio: 'Instituição de ensino superior em Manaus/AM, referência na Amazônia. Oferece cursos de graduação, pós-graduação e extensão, com foco em inovação, qualidade acadêmica e impacto social. Formamos profissionais preparados para transformar vidas e comunidades.',
      logo_url: 'https://ser.responsavel.app.br/logo/logoUninorteFB.jpg',
      cep: '69020-030',
      address_street: 'Av. Joaquim Nabuco',
      address_number: '1281',
      address_complement: 'Bloco A',
      address_neighborhood: 'Centro',
      address_city: 'Manaus',
      address_state: 'AM',
    },
    {
      name: 'StdOut Dev',
      bio: 'Fábrica de software especializada em soluções digitais sob medida. Atuamos no desenvolvimento de sistemas web, APIs e integrações, unindo inovação, qualidade e agilidade para transformar ideias em tecnologia de impacto.',
      logo_url: 'https://ser.responsavel.app.br/logo/logoStdNeonWhite_500x500.png',
      cep: '60115-282',
      address_street: 'Rua Maria Tomásia',
      address_number: '531',
      address_complement: 'Sala 1201',
      address_neighborhood: 'Aldeota',
      address_city: 'Fortaleza',
      address_state: 'CE',
    },
  ]

  const { data, error } = await supabase
    .from('organizations')
    .insert(organizations)
    .select('id, name')

  if (error) return logErrorAndExit('Organizations', error)

  logStep('Organizations seeded successfully.')

  const enriched = []
  for (const row of data ?? []) {
    const meta = organizations.find((item) => item.name === row.name)
    if (meta) {
      enriched.push({ id: row.id, ...meta })
    }
  }

  return enriched
}

const seedTasks = async (numEntries, projectsIds, userId) => {
  logStep('Seeding tasks...')
  const tasks = []

  for (let i = 0; i < numEntries; i++) {
    tasks.push({
      name: faker.lorem.words(3),
      status: faker.helpers.arrayElement(['in-progress', 'completed']),
      description: faker.lorem.paragraph(),
      due_date: faker.date.future(),
      profile_id: userId,
      project_id: faker.helpers.arrayElement(projectsIds),
      collaborators: faker.helpers.arrayElements([userId]),
    })
  }

  const { data, error } = await supabase.from('tasks').insert(tasks).select('id')

  if (error) return logErrorAndExit('Tasks', error)

  logStep('Tasks seeded successfully.')

  return data
}

const seedDatabase = async (numEntriesPerTable) => {
  const organizations = await seedOrganizations()

  let userId

  const testUserId = await primaryTestUserExists()

  if (!testUserId) {
    userId = await createPrimaryTestUser()
  } else {
    userId = testUserId
  }

  const projectsIds = (await seedProjects(numEntriesPerTable, userId, organizations)).map(
    (project) => project.id,
  )

  await seedTasks(numEntriesPerTable, projectsIds, userId)
}

const numEntriesPerTable = 10

const runSeed = async () => {
  try {
    await seedDatabase(numEntriesPerTable)
    logStep('Database seeded successfully.')
    process.exit(0)
  } catch (error) {
    console.error('Unexpected error while seeding database:', error)
    process.exit(1)
  }
}

void runSeed()
