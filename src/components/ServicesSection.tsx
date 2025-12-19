import { motion } from "framer-motion";
import { Target, TrendingUp, Users, Zap, BarChart3, Globe } from "lucide-react";

const services = [
  {
    icon: Target,
    title: "Таргетированная реклама",
    description: "Точное попадание в вашу целевую аудиторию с помощью AI-алгоритмов",
  },
  {
    icon: TrendingUp,
    title: "Контекстная реклама",
    description: "Эффективные рекламные кампании в поисковых системах",
  },
  {
    icon: Users,
    title: "SMM продвижение",
    description: "Комплексное ведение социальных сетей и работа с аудиторией",
  },
  {
    icon: Zap,
    title: "Медийная реклама",
    description: "Яркие баннеры и видеореклама на топовых площадках",
  },
  {
    icon: BarChart3,
    title: "Аналитика и отчёты",
    description: "Детальная статистика и прозрачные отчёты о результатах",
  },
  {
    icon: Globe,
    title: "Международный охват",
    description: "Выход на новые рынки и аудитории по всему миру",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export const ServicesSection = () => {
  return (
    <section className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-glow opacity-30" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Наши <span className="gradient-text">услуги</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Полный спектр рекламных услуг для достижения ваших бизнес-целей
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              className="p-8 rounded-2xl card-gradient border border-border/50 hover:border-primary/50 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <service.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3 text-foreground">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
