import { motion, AnimatePresence } from "framer-motion";
<AnimatePresence>
  {todos.map(t => (
    <motion.li key={t.id} initial={{opacity:0, y:-8}} animate={{opacity:1, y:0}} exit={{opacity:0, scale:0.95}} layout>
      <TodoItem ... />
    </motion.li>
  ))}
</AnimatePresence>
