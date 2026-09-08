# Analysis Report: Cognitive Load Study

**Date**: January 2024  
**Participants**: 10  
**Researcher**: Awa Mbaye

---

## Executive Summary

This study compared **simple vs complex interfaces** to investigate the impact of interface complexity on cognitive load and task performance.

### Key Findings

- ✅ **Six significant differences** found between interfaces
- 🏆 **52.4% faster** task completion with simple interface
- 🧠 **66.7% lower** mental demand with simple interface
- 😤 **84% lower** frustration with simple interface
- ⭐ **SUS Score**: 66.8 (Grade C - Okay)

---

## Participant Demographics

| Demographic                | Value            |
| -------------------------- | ---------------- |
| **Total Participants**     | 10               |
| **Gender**                 | 5 Female, 5 Male |
| **Age Range**              | 18 - 67 years    |
| **Average Age**            | 31.1 years       |
| **Tech Experience (1-10)** | 6.8              |

### Education Distribution

| Education Level | Count |
| --------------- | ----- |
| Master's        | 3     |
| High School     | 3     |
| Some College    | 2     |
| Bachelor's      | 1     |
| PhD             | 1     |

---

## Descriptive Statistics

### Interface A (Simple Navigation)

| Metric              | Mean          |
| ------------------- | ------------- |
| **Completion Time** | 12.93 seconds |
| **Error Rate**      | 0.60 errors   |
| **Success Rate**    | 100.0%        |

**NASA-TLX Scores:**
| Dimension | Score |
|-----------|-------|
| Mental Demand | 1.2 |
| Physical Demand | 0.4 |
| Temporal Demand | 0.9 |
| Performance | 9.1 |
| Effort | 0.8 |
| Frustration | 0.4 |

---

### Interface B (Complex Navigation)

| Metric              | Mean          |
| ------------------- | ------------- |
| **Completion Time** | 27.18 seconds |
| **Error Rate**      | 0.10 errors   |
| **Success Rate**    | 100.0%        |

**NASA-TLX Scores:**
| Dimension | Score |
|-----------|-------|
| Mental Demand | 3.6 |
| Physical Demand | 1.3 |
| Temporal Demand | 2.6 |
| Performance | 7.8 |
| Effort | 1.7 |
| Frustration | 2.5 |

---

### SUS Score

| Metric                | Value        |
| --------------------- | ------------ |
| **Average SUS Score** | 66.8         |
| **Range**             | 25.0 - 100.0 |
| **Grade**             | C (Okay)     |

---

## Statistical Analysis

### Paired T-Tests (Interface A vs B)

| Metric              | Interface A Mean | Interface B Mean | t-statistic | p-value | Effect Size (d) | Significant |
| ------------------- | ---------------- | ---------------- | ----------- | ------- | --------------- | ----------- |
| **Completion Time** | 12.93            | 27.18            | -2.553      | 0.031   | -1.092          | ✅ YES      |
| **Error Rate**      | 0.60             | 0.10             | 1.464       | 0.177   | 0.542           | ❌ NO       |
| **Success Rate**    | 100.00           | 100.00           | nan         | nan     | 0.000           | ❌ NO       |
| **Mental Demand**   | 1.20             | 3.60             | -4.000      | 0.003   | -1.062          | ✅ YES      |
| **Physical Demand** | 0.40             | 1.30             | -1.711      | 0.121   | -0.560          | ❌ NO       |
| **Temporal Demand** | 0.90             | 2.60             | -4.636      | 0.001   | -0.970          | ✅ YES      |
| **Performance**     | 9.10             | 7.80             | 3.881       | 0.004   | 0.666           | ✅ YES      |
| **Effort**          | 0.80             | 1.70             | -2.377      | 0.041   | -0.451          | ✅ YES      |
| **Frustration**     | 0.40             | 2.50             | -3.706      | 0.005   | -1.142          | ✅ YES      |

---

### Effect Size Interpretation

| Effect Size | Interpretation          | Metric          |
| ----------- | ----------------------- | --------------- |
| d = 1.142   | **Large Effect**        | Frustration     |
| d = 1.092   | **Large Effect**        | Completion Time |
| d = 1.062   | **Large Effect**        | Mental Demand   |
| d = 0.970   | **Large Effect**        | Temporal Demand |
| d = 0.666   | **Medium Effect**       | Performance     |
| d = 0.542   | **Medium Effect**       | Error Rate      |
| d = 0.451   | **Small-Medium Effect** | Effort          |

---

## Key Insights

### 1. Task Completion Time

- Interface A: **12.93 seconds**
- Interface B: **27.18 seconds**
- **52.4% faster** with simple interface
- **Significant difference** (p = 0.031)

### 2. Mental Demand (NASA-TLX)

- Interface A: **1.2**
- Interface B: **3.6**
- **66.7% lower** with simple interface
- **Highly significant** (p = 0.003)

### 3. Temporal Demand

- Interface A: **0.9**
- Interface B: **2.6**
- **65.4% lower** with simple interface
- **Highly significant** (p = 0.001)

### 4. Frustration

- Interface A: **0.4**
- Interface B: **2.5**
- **84% lower** with simple interface
- **Highly significant** (p = 0.005)

### 5. Perceived Performance

- Interface A: **9.1**
- Interface B: **7.8**
- Participants felt they performed **14.3% better** with simple interface
- **Significant difference** (p = 0.004)

### 6. Effort

- Interface A: **0.8**
- Interface B: **1.7**
- **52.9% less effort** with simple interface
- **Significant difference** (p = 0.041)

### 7. Error Rate

- Interface A: **0.60 errors**
- Interface B: **0.10 errors**
- **Not significant** (p = 0.177)
- Complex interface actually had **fewer errors** (83.3% reduction)

---

## Discussion

### Why Simple Interfaces Are Better

1. **Reduced Extraneous Cognitive Load**
   - Less information to process
   - Clearer visual hierarchy
   - Progressive disclosure reduces overwhelm

2. **Improved Task Efficiency**
   - Faster completion times (52.4% reduction)
   - Less mental effort required
   - Lower frustration levels

3. **Better User Experience**
   - Higher perceived performance
   - Lower temporal demand
   - Overall more positive experience

### Why Complex Interfaces Had Fewer Errors

Interestingly, Interface B had **83.3% fewer errors** despite being more complex. Possible explanations:

1. **Increased Attention**: Participants were more careful
2. **More Practice**: Interface B was completed after Interface A
3. **Better Feedback**: Complex interface may have had clearer feedback

---

## Recommendations

### For Interface Design

1. **Use Progressive Disclosure**
   - Show only essential information first
   - Reveal more detail as users need it

2. **Minimize Cognitive Load**
   - Reduce unnecessary information
   - Use clear visual hierarchy
   - Group related items

3. **Provide Clear Feedback**
   - Help users understand their actions
   - Reduce uncertainty

4. **Simple is Better**
   - Complex interfaces increase mental demand
   - Faster completion with simple design
   - Lower frustration and effort

---

## Limitations

1. **Sample Size**: Only 10 participants
2. **Practice Effect**: Interface B always after Interface A
3. **Task Nature**: Specific tasks may not generalize
4. **Participant Demographics**: Limited diversity
5. **One Session**: No long-term usage assessment

---

## Future Research

1. **Larger Sample Size**: Increase to 30+ participants
2. **Counterbalancing**: Randomize interface order
3. **Longitudinal Study**: Assess learning over time
4. **Eye Tracking**: Measure visual attention patterns
5. **Biometric Data**: Heart rate, skin conductance

---

## Visualizations

![Study Results](../results/study_results.png)

_Figure 1: Comprehensive visualization dashboard showing all metrics_

---

## Conclusion

This study demonstrates that **interface complexity significantly impacts cognitive load and task performance**. Simple interfaces with progressive disclosure lead to:

- ✅ **Faster task completion** (52.4% improvement)
- ✅ **Lower cognitive load** (66.7% less mental demand)
- ✅ **Less frustration** (84% reduction)
- ✅ **Better perceived performance** (14.3% improvement)

**Recommendation**: Design interfaces with simplicity and progressive disclosure to optimize user experience and reduce cognitive load.

---

## References

- Sweller, J. (1988). Cognitive load during problem solving. _Cognitive Science_, 12(2), 257-285.
- Hart, S. G., & Staveland, L. E. (1988). Development of NASA-TLX. _Advances in Psychology_, 52, 139-183.
- Brooke, J. (1996). SUS: A "quick and dirty" usability scale. _Usability Evaluation in Industry_, 189-194.
- Nielsen, J. (1993). _Usability Engineering_. Academic Press.

---

## Appendix

### Raw Data Summary

```csv
participant_id,age,gender,education,tech_experience,...
P001,25,Female,Bachelor's,7,...
P002,31,Male,Master's,8,...
...
```
