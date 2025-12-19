import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Стартовый",
    price: "10 000",
    description: "Идеально для малого бизнеса",
    features: [
      "Базовая настройка рекламы",
      "1 рекламная площадка",
      "Еженедельные отчёты",
      "Email поддержка",
      "До 5 000 показов",
    ],
    popular: false,
  },
  {
    name: "Бизнес",
    price: "20 000",
    description: "Оптимальный выбор для роста",
    features: [
      "Расширенная настройка рекламы",
      "3 рекламные площадки",
      "Ежедневные отчёты",
      "Приоритетная поддержка",
      "До 20 000 показов",
      "A/B тестирование",
      "Персональный менеджер",
    ],
    popular: true,
  },
  {
    name: "Премиум",
    price: "50 000",
    description: "Максимальные результаты",
    features: [
      "Полная автоматизация",
      "Все рекламные площадки",
      "Отчёты в реальном времени",
      "24/7 поддержка",
      "Неограниченные показы",
      "AI-оптимизация",
      "Выделенная команда",
      "Креативы под ключ",
    ],
    popular: false,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export const PricingSection = () => {
  return (
    <section className="py-24 px-4 relative" id="pricing">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            <span className="gradient-text">Тарифы</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Выберите план, который подходит именно вашему бизнесу
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className={`relative p-8 rounded-3xl transition-all duration-500 ${
                plan.popular
                  ? "card-gradient border-2 border-primary glow-effect"
                  : "card-gradient border border-border/50 hover:border-primary/30"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    <Star className="w-4 h-4" />
                    Популярный
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-display font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </div>

              <div className="mb-8">
                <span className="text-5xl font-display font-bold gradient-text">
                  {plan.price}
                </span>
                <span className="text-muted-foreground ml-2">₽/мес</span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full py-6 text-lg ${
                  plan.popular ? "glow-effect" : ""
                }`}
                variant={plan.popular ? "default" : "outline"}
              >
                Выбрать план
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
