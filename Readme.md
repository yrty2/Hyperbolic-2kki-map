# ☆　双曲地図　☆


ゆめ2っきマップの双曲埋め込みです。


## 双曲平面ってなあに


双曲平面はホールケーキの上の世界です。
ただし、ホールケーキの中心から離れるほど体が小さくなります。
故に、ホールケーキの中心から何歩あるいてもケーキの上から脱出することはできません。
中心から離れるほど体が小さくなるので、中心周りの円周を一周するまでにかかる歩数は遠くなるほど爆発的に増加します。


## なぜ双曲平面か


一般に、双曲埋め込みはファイルシステムや系統樹のような木構造を持つグラフを可視化する際に用いられる手法である。双曲空間は空間そのものが木構造となっている(グロモフ双曲性)。


これは非常に面白い性質であり、例えば通常マインスイーパーは計算量クラスNP完全に属するが、双曲平面上のマインスイーパーは木構造のおかげで、計算量クラスPに属している。(https://arxiv.org/abs/2002.09534)


また双曲平面は通常の平面より密であるため、双曲平面上の二直線は交点を持たないことが多く大量のノードを持つグラフを可視化する際に便利である。


コネクトーム(ニューラルネットワークのグラフ)の双曲埋め込みには階層構造を可視化しやすいという利点があるとされており、これはゆめ2っきへの応用である。

# ☆ Hyperbolic Map ☆

This is a hyperbolic embedding of the Yume2kki map.

## What is a Hyperbolic Plane?

The hyperbolic plane is the world on top of a whole cake.

However, the further you are from the center of the cake, the smaller your body becomes.

Therefore, no matter how many steps you take from the center of the cake, you cannot escape from the top of the cake.

Because your body becomes smaller the further you are from the center, the number of steps it takes to complete one lap around the circumference of the center increases exponentially with distance.

## Why a Hyperbolic Plane?

Generally, hyperbolic embeddings are a technique used to visualize graphs with tree structures, such as file systems and phylogenetic trees. Hyperbolic space itself has a tree structure (Gromov hyperbolicity).

This is a very interesting property; for example, while Minesweeper normally belongs to the NP-complete complexity class, Minesweeper on the hyperbolic plane belongs to the P complexity class thanks to its tree structure. (https://arxiv.org/abs/2002.09534)

Furthermore, because the hyperbolic plane is denser than a normal plane, two lines on the hyperbolic plane often do not intersect, which is useful when visualizing graphs with a large number of nodes.

Hyperbolic embedding of connectomes (neural network graphs) is said to have the advantage of making hierarchical structures easier to visualize, and this is an application to Yume2kki.
