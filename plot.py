# Utility to plot evaluations
# Uncomment one section at a time.

import matplotlib.pyplot as plt
import numpy as np
import itertools

# species = (
#     "Mint",
#     "List",
#     "Buy",
# )
# weight_counts = {
#     "Enclave time": np.array([1.324083333, 0.7544166667, 0.7526666667]),
#     "Signing time": np.array([0.2369166667, 0.2156666667, 0.1489166667]),
# }
# width = 0.4

# plt.rcParams["figure.figsize"] = (4.5,4.5)
# plt.rcParams.update({'font.family': 'monospace'})
# plt.rcParams["font.weight"] = "bold"
# plt.rcParams["axes.labelweight"] = "bold"
# fig, ax = plt.subplots()
# bottom = np.zeros(3)

# x = np.arange(len(species))
# for boolean, weight_count in weight_counts.items():
#     if boolean == "Enclave time":
#         p = ax.bar(species, weight_count, width, label=boolean, bottom=bottom, align='center', color='orangered')
#     else:
#         p = ax.bar(species, weight_count, width, label=boolean, bottom=bottom, align='center', color='deepskyblue')
#     bottom += weight_count

# num_locations = 3
# hatches = itertools.cycle(['/', 'xx', '\\', '+',  '//', '+', '-', 'o', 'O', '.'])
# for i, bar in enumerate(ax.patches):
#     if i % num_locations == 0:
#         hatch = next(hatches)
#     bar.set_hatch(hatch)

# ax.set_ylabel("Time in milli seconds", fontname = 'monospace')
# ax.set_xticks(x, species, fontname = 'monospace')
# #ax.legend(loc="upper right")
# ax.legend(loc='upper center', bbox_to_anchor=(0.5, 1.1), ncol=3, fancybox=True, prop={'family':'monospace'})

# plt.show()


# species = (
#     "LiftPlace",
#     "On-chain",
#     "Opensea",
# )
# penguin_means = {
#     "Mint": np.array([0.7805, 15117.4, 0]),
#     "List": np.array([0.7559, 16202.1, 4305.15]),
#     "Buy": np.array([0.7524, 14089.9, 16073.85]),
#     # "Query Time": np.array([148.83716, 153.6777222, 180.7672664]),
# }
# x = np.arange(len(species))  # the label locations
# width = 0.2  # the width of the bars
# multiplier = 0

# plt.rcParams["figure.figsize"] = (4.5,4.5)
# plt.rcParams.update({'font.family': 'monospace'})
# plt.rcParams["font.weight"] = "bold"
# plt.rcParams["axes.labelweight"] = "bold"
# fig, ax = plt.subplots()

# for attribute, measurement in penguin_means.items():
#     offset = width * multiplier
#     if attribute == "Mint":
#         rects = ax.bar(x+offset, measurement, width, label=attribute, color='orangered')
#     elif attribute == "List":
#         rects = ax.bar(x+offset, measurement, width, label=attribute, color='deepskyblue')
#     elif attribute == "Buy":
#         rects = ax.bar(x+offset, measurement, width, label=attribute, color='darkorchid')
#     else:
#         rects = ax.bar(x+offset, measurement, width, label=attribute, color='firebrick')
#     #ax.bar_label(rects, padding=3)
#     multiplier += 1

# num_locations = 3
# hatches = itertools.cycle(['/', 'xx', '\\', '+',  '//', '+', '-', 'o', 'O', '.'])
# for i, bar in enumerate(ax.patches):
#     if i % num_locations == 0:
#         hatch = next(hatches)
#     bar.set_hatch(hatch)

# # Add some text for labels, title and custom x-axis tick labels, etc.
# ax.set_ylabel('Time in milli seconds (log scale)', fontname = 'monospace')
# #ax.set_title('Penguin attributes by species')
# ax.set_xticks(x + width, species, fontname = 'monospace')
# ax.set_yscale('log')
# ax.legend(loc='upper center', bbox_to_anchor=(0.5, 1.1), ncol=3, fancybox=True, prop={'family':'monospace'})
# #ax.set_ylim(0, 250)

# plt.show()



data = {"Mint":256942.7326, "List":220309.5081, "Buy":134397.002}
data2 = {"Mint":0.48, "List":0.41, "Buy":0.25}
x_pos = [0,2,4]
courses = list(data.keys())
values = list(data.values())
values2 = list(data2.values())
plt.rcParams["figure.figsize"] = (5,5)
plt.rcParams.update({'font.family': 'monospace'})
plt.rcParams["font.weight"] = "bold"
plt.rcParams["axes.labelweight"] = "bold"
# fig = plt.figure()
fig, ax = plt.subplots()
ax2 = ax.twinx()
# creating the bar plot
ax.bar(courses, values, color ='slateblue',
       width = 0.4, hatch='xx')
ax2.bar(courses, values2, color ='slateblue',
        width = 0.4, hatch='xx')
#plt.xlabel("MaxPriorityGasFee")
# ax.set_xticks(courses, weight='bold')
ax2.set_ylabel('Equivalent USD', weight='bold')
ax.set_ylabel('Transaction Fees in Gwei', weight='bold')
fig.tight_layout()
plt.show()

# data = {"1000 wei":44.62582655, "1 Gwei":18.99524777, "1.5 Gwei":16.30710722, "10 Gwei":16.55933105}
# courses = list(data.keys())
# values = list(data.values())
# plt.rcParams["figure.figsize"] = (5,5)
# plt.rcParams.update({'font.family': 'monospace'})
# plt.rcParams["font.weight"] = "bold"
# plt.rcParams["axes.labelweight"] = "bold"
# fig = plt.figure()

# # creating the bar plot
# plt.bar(courses, values, color ='deepskyblue',
#         width = 0.4, hatch='xx')

# plt.xlabel("MaxPriorityGasFee")
# plt.ylabel("Average transaction time in seconds")
# plt.show()


# data = {"Average":148.83716, "70 Percentile":153.6777222, "90 Percentile":180.7672664}
# courses = list(data.keys())
# values = list(data.values())
# plt.rcParams["figure.figsize"] = (4.5,4.5)
# plt.rcParams.update({'font.family': 'monospace'})
# plt.rcParams["font.weight"] = "bold"
# plt.rcParams["axes.labelweight"] = "bold"
# fig = plt.figure()

# # creating the bar plot
# plt.bar(courses, values, color ='deepskyblue',
#         width = 0.4, hatch='xx')

# #plt.xlabel("MaxPriorityGasFee")
# plt.ylabel("Query time in milli seconds")
# plt.show()

# fig 14(with and without sgx)
# plt.rcParams["figure.figsize"] = (5,5)
# plt.rcParams.update({'font.family': 'monospace'})
# plt.rcParams["font.weight"] = "bold"
# plt.rcParams["axes.labelweight"] = "bold"
# fig, ax = plt.subplots()

# x = [1, 10, 100, 500, 1000]
# y1 = [11.76470588, 84.74576271, 278.551532, 289.6032436, 303.5822708]
# y2 = [12.04819277, 92.59259259, 364.9635036, 419.2872117, 492.6108374]
# y3 = [0.06615069127, 0.5562044608, 0.5804302149, 1.39742092, 1.5857209]
# y4 = [0.05696058328, 0.3045994517, 1.147811653, 1.202543921, 1.254466702]
# y5 = [27, 27, 27, 27, 27]
# plt.plot(x, y1, marker='o', label ='With SGX', color='deepskyblue')
# plt.plot(x, y2, marker='x', label ='Without SGX', color='orangered')
# plt.plot(x, y3, marker='*', label ='On-chain', color='green')
# plt.plot(x, y4, marker='.', label ='Opensea', color='deeppink')
# plt.plot(x, y5, marker='^', label ='Ethereum Mainnet', color='darkorchid')

# plt.xlabel("Number of transactions")
# plt.ylabel("Throughput (log scale)")
# plt.yscale("log")
# plt.legend(loc='upper center', bbox_to_anchor=(0.5, 1.1), ncol=3, fancybox=True, prop={'family':'monospace'})

# plt.grid()
# #plt.title('multiple plots')
# plt.show()